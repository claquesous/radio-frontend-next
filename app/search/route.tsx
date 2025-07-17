export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const streamId = searchParams.get('stream_id')
  let url = process.env.RADIO_BACKEND_PATH + `/songs?query=${query}&limit=10`
  if (streamId) {
    url += `&stream_id=${streamId}`
  }
  const res = await fetch(url)
  const data = await res.json()

  return Response.json(data)
}
