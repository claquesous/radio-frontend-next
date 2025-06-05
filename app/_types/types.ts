export type Artist = {
  id: number
  name: string
  sort: number | null
  slug: string | null
}

export type Album = {
  id: number
  title: string
  artist: Artist // Add artist to Album type
  sort: number | null
  slug: string | null
  tracks: number | null
  id3_genre: string | null
  record_label: string | null
}

export type Song = {
  id: number
  title: string
  rating: number
  artist: Artist
  album: Album | null
  artist_name_override: string | null
  sort: number | null
  slug: string | null
  track: number | null
  time: string | null
  live: boolean
  remix: boolean
  year: number | null
}

export type Stream = {
  id: number
  name: string
  default_rating: number
  default_featured: boolean
  mastodon_url: string
  mastodon_access_token: string
}

export type Play = {
  id: number
  artist: Artist
  song: Song
  stream: Stream
  ratings_count: number
  playtime: string
  tweet_id: string | null
}

export type PlayStats = {
  id: number
  last_week_rank: number
  rank: number
  play_count: number
  last_played_at: string
  previous_played_at: string
}

export type Chooser = {
  id: number
  song: Song
  featured: boolean
  rating: number
}

export type ChooserFormData = {
  featured: boolean
  rating: number
}

export type Request = {
  id: number
  song: Song
  requested_at: string
  played: boolean
}
