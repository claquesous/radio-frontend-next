import Plays from './_components/plays'

export default async function StreamHome({ params }: { params: Promise<{ streamId: number }> }) {
  const { streamId } = await params
  return <Plays streamId = {streamId}/>
}
