import Plays from './_components/plays'

export default function StreamHome({ params }: { params: { streamId: number } }) {
  const { streamId } = params
  return <Plays streamId = {streamId}/>
}

