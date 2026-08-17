import dynamic from 'next/dynamic'
import StreamSearchboxWrapper from './_components/stream-searchbox-wrapper'

const DynamicGlobalPlayer = dynamic(() => import('../../_components/global-player'))

export default async function StreamsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ streamId: string }>
}>) {
  const { streamId } = await params
  return (
    <div className="bg-slate-900 text-slate-100 min-h-full flow-root">
      <DynamicGlobalPlayer streamId={Number(streamId)} />
      <div className="px-4 sm:px-6 py-4">
        <div className="mb-4 flex justify-end">
          <StreamSearchboxWrapper streamId={Number(streamId)} />
        </div>
        {children}
      </div>
    </div>
  )
}
