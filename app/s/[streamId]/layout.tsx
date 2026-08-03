import dynamic from 'next/dynamic'
import StreamSearchboxWrapper from './_components/stream-searchbox-wrapper'

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
        <StreamSearchboxWrapper streamId={Number(streamId)} />
      </div>
      {children}
    </div>
  </>)
}
