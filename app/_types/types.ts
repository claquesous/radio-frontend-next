export type Artist = {
  id: number
  name: string
}

export type Song = {
  id: number
  title: string
  rating: number
  artist: Artist
}

export type Play = {
  id: number
  artist: Artist
  song: Song
}

export type PlayStats = {
  id: number
  last_week_rank: number
  rank: number
  play_count: number
  last_played_at: string
  previous_played_at: string
}

export type Stream = {
  name: string
}

