import dynamic from 'next/dynamic'

const DynamicPlayer = dynamic(() => import('./_components/player'), {
  ssr: false,
})

export default function StreamsLayout({
  children, params
}: Readonly<{
  children: React.ReactNode,
  params: { streamId: number },
}>) {
  const { streamId } = params
  return (<>
    <DynamicPlayer streamId={streamId} />
    <div className="pt-2">
      {children}
    </div>
  </>)
}

