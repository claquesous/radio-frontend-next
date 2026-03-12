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
    <div
      className="flex bg-slate-900"
      style={{ height: 'calc(100dvh - 56px)' }}
    >
      {/* ── Persistent player sidebar ─────────────────────── */}
      <aside className="w-72 lg:w-80 xl:w-96 flex-shrink-0 flex flex-col overflow-y-auto bg-slate-800/50 border-r border-slate-700/50">
        <DynamicGlobalPlayer streamId={Number(streamId)} />
      </aside>

      {/* ── Scrollable content area ───────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-shrink-0 px-5 py-3 bg-slate-900/90 border-b border-slate-700/50 flex items-center justify-end backdrop-blur-sm">
          <StreamSearchboxWrapper streamId={Number(streamId)} />
        </div>
        <main className="flex-1 overflow-y-auto px-6 py-5 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  )
}
