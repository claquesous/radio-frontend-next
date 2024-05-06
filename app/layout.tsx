import type { Metadata } from "next"
import { Inter } from "next/font/google"
import TopBar from './_components/topbar'
import Footer from './_components/footer'
import Player from './_components/player'
import "./globals.css";

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
        <header className="fixed top-0 w-full bg-slate-500 shadow-md">
          <TopBar />
        </header>
        <Player />
        <div className="pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
