import dynamic from 'next/dynamic'
import StreamSearchbox from './_components/stream-searchbox'

const DynamicGlobalPlayer = dynamic(() => import('../../_components/global-player'))

export default async function StreamsLayout({
  children, params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ streamId: number }>,
}>) {
  const { streamId } = await params
  return (
    <>
      <div className="py-2 overflow-x-hidden">
        <DynamicGlobalPlayer streamId={streamId} />
        <div className="mb-4 flex justify-end">
          <StreamSearchbox streamId={streamId} />
        </div>
        {children}
      </div>
    </>
  )
}
