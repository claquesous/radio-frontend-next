import type { Metadata } from "next"
import dynamic from 'next/dynamic'
import { Inter } from "next/font/google"
import TopBar from './_components/top-bar'
import Footer from './_components/footer'
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
        <header className="sticky top-0 py-1 w-full bg-slate-500 shadow-md z-50">
          <TopBar />
        </header>
        <div className="primary-content pb-4">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
