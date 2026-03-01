import dynamic from 'next/dynamic'
import StreamSearchbox from './_components/stream-searchbox'

const DynamicGlobalPlayer = dynamic(() => import('../../_components/global-player'))

export default async function StreamsLayout({
  children, params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ streamId: string }>,
}>) {
  const { streamId } = await params
  return (<>
    <DynamicGlobalPlayer streamId={Number(streamId)} />
    <div className="py-2">
      <div className="mb-4 flex justify-end">
        <StreamSearchbox streamId={Number(streamId)} />
      </div>
      {children}
    </div>
  </>)
}
