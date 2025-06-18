'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ManagePage() {
  const [lastPlayedStreamId, setLastPlayedStreamId] = useState<string | null>(null)

  useEffect(() => {
    const lastStream = localStorage.getItem('lastPlayedStream')
    setLastPlayedStreamId(lastStream)
  }, [])

  return (
    <div className="manage-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Manage
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your radio station content and settings.
          </p>
          <Link
              href={'/manage/streams'}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Streams
            </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Last Played Stream
          </h3>
          {lastPlayedStreamId ? (
            <Link
              href={`/s/${lastPlayedStreamId}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go to Stream {lastPlayedStreamId}
            </Link>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No recently played stream found.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Additional management options will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
