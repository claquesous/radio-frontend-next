import dynamic from 'next/dynamic'

const DynamicPlayer = dynamic(() => import('./../../_components/player'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <DynamicPlayer />
    <div className="pt-16">
      {children}
    </div>
  </>)
}
