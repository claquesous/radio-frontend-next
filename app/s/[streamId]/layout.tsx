import dynamic from 'next/dynamic'
import StreamSearchbox from './_components/stream-searchbox'

const DynamicPlayer = dynamic(() => import('./_components/player'))

export default async function StreamsLayout({
  children, params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ streamId: number }>,
}>) {
  const { streamId } = await params
  return (<>
    <DynamicPlayer streamId={streamId} />
    <div className="pt-2">
      <div className="mb-4 flex justify-end">
        <StreamSearchbox streamId={streamId} />
      </div>
      {children}
    </div>
  </>)
}
