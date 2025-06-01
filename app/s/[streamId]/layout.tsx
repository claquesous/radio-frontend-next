import dynamic from 'next/dynamic'

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
      {children}
    </div>
  </>)
}
