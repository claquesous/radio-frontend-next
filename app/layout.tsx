import type { Metadata } from "next"
import { Bebas_Neue, DM_Sans } from "next/font/google"
import TopBar from './_components/top-bar'
import Footer from './_components/footer'
import { AudioProvider } from './_contexts/audio-context'
import "./globals.css"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Claq Radio",
  description: "Our space age algorithms are guaranteed to give you the most eclectic mix of alternative music.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <AudioProvider>
          <header className="sticky top-0 py-2 sm:py-3 w-full bg-slate-800 shadow-lg z-50 border-b border-slate-700">
            <TopBar />
          </header>
          <div className="primary-content overflow-x-hidden">
            {children}
          </div>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  )
}
