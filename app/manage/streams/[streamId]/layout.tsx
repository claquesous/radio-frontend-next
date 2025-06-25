import React from 'react'
import StreamNavigation from './_components/StreamNavigation'

export default async function StreamManageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ streamId: string }>
}) {
  const { streamId } = await params
  return (
    <div className="stream-manage-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <header className="stream-header mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Manage Stream
          </h1>
          <StreamNavigation streamId={streamId} />
        </header>
        <main className="stream-content">
          {children}
        </main>
        <p id="alert"></p>
      </div>
    </div>
  )
}
