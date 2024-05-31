import type { Metadata } from "next"
import dynamic from 'next/dynamic'
import { Inter } from "next/font/google"
import TopBar from './_components/topbar'
import Footer from './_components/footer'
import "./globals.css";

const DynamicPlayer = dynamic(() => import('./_components/player'), {
  ssr: false,
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Claq Radio",
  description: "Our space age algorithms are guaranteed to give you the most eclectic mix of alternative music.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 py-1 w-full bg-slate-500 shadow-md">
          <TopBar />
        </header>
        <div>
          <DynamicPlayer />
          <div className="pt-16">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  )
}
