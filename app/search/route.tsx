export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/songs?query=${query}&limit=10`)
  const data = await res.json()

  return Response.json(data)
}

