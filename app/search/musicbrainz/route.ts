import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const entity = url.searchParams.get('entity') // 'artist', 'album', 'song'
  const query = url.searchParams.get('query')
  const id = url.searchParams.get('id')
  const inc = url.searchParams.get('inc')
  const limit = url.searchParams.get('limit') || '10'

  let mbUrl = ''
  // Fetch by ID for artist
  if (entity === 'artist' && id) {
    const incParam = inc ? `&inc=${encodeURIComponent(inc)}` : ''
    mbUrl = `https://musicbrainz.org/ws/2/artist/${encodeURIComponent(id)}?fmt=json${incParam}`
    try {
      const resp = await fetch(mbUrl, {
        headers: {
          'User-Agent': 'ClaqRadio/1.0'
        }
      })
      const data = await resp.json()
      return NextResponse.json({ artist: data })
    } catch (err) {
      return NextResponse.json({ error: 'Failed to fetch from Musicbrainz' }, { status: 500 })
    }
  }

  // Fetch by ID for album (release-group)
  if (entity === 'album' && id) {
    mbUrl = `https://musicbrainz.org/ws/2/release-group/${encodeURIComponent(id)}?fmt=json`
    try {
      const resp = await fetch(mbUrl, {
        headers: {
          'User-Agent': 'ClaqRadio/1.0'
        }
      })
      const data = await resp.json()
      // Try to fetch cover art from coverartarchive.org
      let coverArtUrl = null
      try {
        const coverResp = await fetch(`https://coverartarchive.org/release-group/${encodeURIComponent(id)}/front`)
        if (coverResp.ok) {
          coverArtUrl = `https://coverartarchive.org/release-group/${encodeURIComponent(id)}/front`
        }
      } catch {}
      return NextResponse.json({ album: { ...data, cover_art_url: coverArtUrl } })
    } catch (err) {
      return NextResponse.json({ error: 'Failed to fetch from Musicbrainz' }, { status: 500 })
    }
  }

  // Search by query
  if (!entity || !query) {
    return NextResponse.json({ error: 'Missing entity or query' }, { status: 400 })
  }

  if (entity === 'artist') {
    mbUrl = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json&inc=annotation+artist-rels+release-group-rels+url-rels`
  } else if (entity === 'album') {
    mbUrl = `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json&inc=annotation`
  } else if (entity === 'song') {
    mbUrl = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json&inc=annotation`
  } else {
    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
  }

  try {
    const resp = await fetch(mbUrl, {
      headers: {
        'User-Agent': 'ClaqRadio/1.0'
      }
    })
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch from Musicbrainz' }, { status: 500 })
  }
}
