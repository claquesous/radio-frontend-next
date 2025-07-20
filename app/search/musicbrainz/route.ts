import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const entity = url.searchParams.get('entity') // 'artist', 'album', 'song'
  const query = url.searchParams.get('query')
  const limit = url.searchParams.get('limit') || '10'

  if (!entity || !query) {
    return NextResponse.json({ error: 'Missing entity or query' }, { status: 400 })
  }

  let mbUrl = ''
  let inc = ''
  if (entity === 'artist') {
    inc = '&inc=annotation+artist-rels+release-group-rels+url-rels'
    mbUrl = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json${inc}`
  } else if (entity === 'album') {
    inc = '&inc=annotation'
    mbUrl = `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json${inc}`
  } else if (entity === 'song') {
    inc = '&inc=annotation'
    mbUrl = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&limit=${limit}&fmt=json${inc}`
  } else {
    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
  }

  try {
    const resp = await fetch(mbUrl, {
      headers: {
        'User-Agent': 'ClaqRadio/1.0 (admin@claqradio.com)'
      }
    })
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch from Musicbrainz' }, { status: 500 })
  }
}
