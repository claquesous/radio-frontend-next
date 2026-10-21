'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../../../../../lib/api'

export type SeedSong = { id: number; title: string }

export type PickerMode = 'search' | 'similar' | 'random' | 'new'

type Candidate = {
  id: number
  title: string
  year: number | null
  artist: { id: number; name: string }
  album?: { title: string } | null
}

type Page = { results: Candidate[]; total?: number; seeds?: SeedSong[] }

const MODES: { mode: PickerMode; label: string }[] = [
  { mode: 'search', label: 'Search' },
  { mode: 'similar', label: 'Similar' },
  { mode: 'random', label: 'Random' },
  { mode: 'new', label: 'New' },
]

const PAGE_SIZE: Record<PickerMode, number> = { search: 25, new: 25, random: 20, similar: 10 }

interface SongPickerProps {
  streamId: number
  mode: PickerMode
  onModeChange: (mode: PickerMode) => void
  // Songs to find similar songs to; null means a sample of the playlist itself.
  seeds: SeedSong[] | null
  onSeedsChange: (seeds: SeedSong[] | null) => void
  playlistSize: number
  // False when no song has been analyzed (e.g. radio-analyzer isn't deployed), which
  // hides everything to do with similar songs.
  similarAvailable: boolean
  // Resolves true when the parent took over (switched to songs similar to the picks).
  onAdd: (songs: SeedSong[]) => Promise<boolean>
  onClose: () => void
}

function describeSeeds(seeds: SeedSong[]) {
  const quoted = seeds.map(s => `“${s.title}”`)
  if (quoted.length <= 2) return quoted.join(' and ')
  return `${quoted.slice(0, 2).join(', ')} and ${quoted.length - 2} more`
}

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}

// One checklist for every way of finding songs not yet in the stream:
// - search and new page through the library by offset;
// - random and similar ask for a fresh batch each time, never repeating a song
//   already shown (until the mode or seeds change).
// Adding songs (from any mode) switches to songs similar to the picks, so a
// playlist can grow outwards from one song.
export default function SongPicker({
  streamId, mode, onModeChange, seeds, onSeedsChange, playlistSize, similarAvailable, onAdd, onClose,
}: SongPickerProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query.trim(), 250)
  const [results, setResults] = useState<Candidate[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const [usedSeeds, setUsedSeeds] = useState<SeedSong[]>([])
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const shown = useRef<Set<number>>(new Set())
  const shownFor = useRef<PickerMode>(mode)
  const request = useRef(0)

  const searchIdle = mode === 'search' && debouncedQuery === ''
  const playlistSeedsMissing = mode === 'similar' && seeds === null && playlistSize === 0

  const fetchPage = useCallback(async (at: number): Promise<Page> => {
    const limit = PAGE_SIZE[mode]
    if (mode === 'search' || mode === 'new') {
      const params = new URLSearchParams({ limit: String(limit), offset: String(at) })
      if (mode === 'search') params.set('query', debouncedQuery)
      else params.set('sort', 'newest')
      const { data } = await api.get<{ songs: Candidate[]; total: number }>(
        `/streams/${streamId}/available_songs?${params}`)
      return { results: data.songs, total: data.total }
    }
    // POSTs, because exclude_ids grows every page and soon outgrows a query string.
    const exclude_ids = Array.from(shown.current)
    if (mode === 'random') {
      const { data } = await api.post<Page>(`/streams/${streamId}/random_songs`, { limit, exclude_ids })
      return data
    }
    const { data } = await api.post<Page>(`/streams/${streamId}/recommendations`, {
      ...(seeds ? { seed_ids: seeds.map(s => s.id) } : {}),
      exclude_ids,
      limit,
    })
    return data
  }, [mode, debouncedQuery, seeds, streamId])

  // Results only count as shown once displayed, so a superseded request (e.g.
  // StrictMode's double effect, or typing ahead) doesn't use up a page.
  const load = useCallback(async (at: number) => {
    const current = ++request.current
    setLoading(true)
    setError(null)
    try {
      const page = await fetchPage(at)
      if (current !== request.current) return
      page.results.forEach(r => shown.current.add(r.id))
      setResults(page.results)
      setTotal(page.total ?? null)
      setOffset(at)
      if (page.seeds) setUsedSeeds(page.seeds)
      setChecked(new Set())
    } catch (e) {
      if (current !== request.current) return
      console.error(`Failed to load ${mode} songs`, e)
      setError('Could not load songs.')
    } finally {
      if (current === request.current) setLoading(false)
    }
  }, [fetchPage, mode])

  // Start over whenever what we're looking for changes. Similar songs already
  // shown stay excluded when the seeds change, so re-seeding finds new ones.
  useEffect(() => {
    if (shownFor.current !== mode) {
      shown.current = new Set()
      shownFor.current = mode
    }
    if (searchIdle || playlistSeedsMissing) {
      request.current++
      setResults([])
      setTotal(null)
      setLoading(false)
      return
    }
    load(0)
  }, [load, mode, searchIdle, playlistSeedsMissing])

  const toggle = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allChecked = results.length > 0 && checked.size === results.length
  const toggleAll = () => setChecked(allChecked ? new Set() : new Set(results.map(r => r.id)))

  const paged = mode === 'search' || mode === 'new'
  const pageSize = PAGE_SIZE[mode]
  const hasMore = paged ? total !== null && offset + pageSize < total : true

  const handleAdd = async () => {
    const picks = results.filter(r => checked.has(r.id))
    if (picks.length === 0) return
    setAdding(true)
    try {
      const handled = await onAdd(picks.map(({ id, title }) => ({ id, title })))
      if (handled) {
        // Nothing more to do here.
      } else if (paged) {
        // Added songs drop out of the listing; reloading backfills the page.
        await load(offset)
      } else {
        await load(0)
      }
    } finally {
      setAdding(false)
    }
  }

  const findSimilar = (song: Candidate) => {
    onSeedsChange([{ id: song.id, title: song.title }])
    onModeChange('similar')
  }

  const busy = loading || adding

  const addLabel = () => {
    if (adding) return 'Adding…'
    if (checked.size === 0) return 'Add selected'
    if (similarAvailable) return `Add ${checked.size} & find similar`
    return `Add ${checked.size}`
  }

  const emptyMessage = () => {
    if (searchIdle) return 'Search the library by title, artist or album. Every word must match.'
    if (playlistSeedsMissing) return 'Add a song first, or use ≈ on any song to find songs like it.'
    if (mode === 'search') return `Nothing matches “${debouncedQuery}”.`
    if (mode === 'similar') return 'No more suggestions. Songs need to be analyzed before they can be matched.'
    return 'No more songs to add.'
  }

  return (
    <div className="fixed inset-0 z-50 h-dvh
                    lg:static lg:h-[calc(100vh-17rem)] lg:min-h-[24rem] lg:rounded-lg lg:shadow-none
                    bg-slate-800 lg:border border-slate-700/60 flex flex-col">
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-slate-700/60">
        {MODES.filter(m => similarAvailable || m.mode !== 'similar').map(m => (
          <button
            key={m.mode}
            onClick={() => onModeChange(m.mode)}
            className={`px-3 py-2 rounded-none bg-transparent hover:bg-transparent text-sm font-medium border-b-2 -mb-px transition-colors ${
              mode === m.mode
                ? 'border-[#8EF7FA] text-[#8EF7FA]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          onClick={onClose}
          className="ml-auto p-2 bg-transparent hover:bg-transparent text-slate-400 hover:text-slate-100 lg:hidden"
          title="Close"
          aria-label="Close song picker"
        >
          ✕
        </button>
      </div>

      {mode === 'search' && (
        <div className="px-4 py-2 border-b border-slate-700/60">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Title, artist or album"
            autoFocus
            className="w-full border border-slate-600 bg-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:border-[#8EF7FA] focus:outline-none"
          />
        </div>
      )}

      {mode === 'similar' && !playlistSeedsMissing && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/60">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-slate-500">Similar to</p>
            <p className="text-sm text-slate-200 truncate">
              {seeds ? describeSeeds(seeds) : `${usedSeeds.length || 'some'} songs from your playlist`}
            </p>
          </div>
          {seeds && playlistSize > 0 && (
            <button
              onClick={() => onSeedsChange(null)}
              className="p-0 bg-transparent hover:bg-transparent font-normal text-xs text-slate-400 hover:text-[#8EF7FA] whitespace-nowrap"
            >
              Use playlist
            </button>
          )}
        </div>
      )}

      <div className="overflow-y-auto overscroll-contain flex-1">
        {error && <p className="px-4 py-3 text-sm text-red-400">{error}</p>}
        {!error && !loading && results.length === 0 && (
          <p className="px-4 py-3 text-sm text-slate-400">{emptyMessage()}</p>
        )}
        {results.length > 0 && (
          <label className="flex items-center gap-3 px-4 py-1.5 text-xs text-slate-500 cursor-pointer border-b border-slate-700/40">
            <input type="checkbox" checked={allChecked} onChange={toggleAll} disabled={busy}
                   className="w-4 h-4 accent-[#8EF7FA]" />
            <span className="flex-1">Select all</span>
            {paged && total !== null && (
              <span>{offset + 1}–{offset + results.length} of {total}</span>
            )}
          </label>
        )}
        <ul className={loading ? 'opacity-50' : ''}>
          {results.map(r => (
            <li key={r.id} className="flex items-center hover:bg-slate-700/40">
              <label className="flex flex-1 min-w-0 items-center gap-3 pl-4 py-1.5 cursor-pointer">
                <input type="checkbox" checked={checked.has(r.id)} onChange={() => toggle(r.id)} disabled={busy}
                       className="w-4 h-4 accent-[#8EF7FA]" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-slate-100 truncate">{r.title}</span>
                  <span className="block text-xs text-slate-400 truncate">
                    {r.artist.name}{r.album?.title ? ` · ${r.album.title}` : ''}{r.year ? ` · ${r.year}` : ''}
                  </span>
                </span>
              </label>
              {similarAvailable && <button
                onClick={() => findSimilar(r)}
                disabled={busy}
                className="px-3 py-2 bg-transparent hover:bg-transparent font-normal text-slate-500 hover:text-[#8EF7FA] disabled:opacity-50"
                title={`Find songs similar to “${r.title}”`}
                aria-label={`Find songs similar to ${r.title}`}
              >
                ≈
              </button>}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 px-4 py-3 border-t border-slate-700/60">
        {paged && offset > 0 && (
          <button
            onClick={() => load(Math.max(0, offset - pageSize))}
            disabled={busy}
            className="px-4 py-2 rounded text-sm font-medium bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
        )}
        <button
          onClick={() => load(paged ? offset + pageSize : 0)}
          disabled={busy || !hasMore || searchIdle || playlistSeedsMissing}
          className="px-4 py-2 rounded text-sm font-medium bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading…' : paged ? 'Next' : 'More'}
        </button>
        <button
          onClick={handleAdd}
          disabled={busy || checked.size === 0}
          className="flex-1 px-4 py-2 rounded text-sm font-medium bg-[#8EF7FA]/15 text-[#8EF7FA] border border-[#8EF7FA]/30 hover:bg-[#8EF7FA]/25 disabled:opacity-50 transition-colors"
        >
          {addLabel()}
        </button>
      </div>
    </div>
  )
}
