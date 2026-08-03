'use client'
import dynamic from 'next/dynamic'

const StreamSearchbox = dynamic(() => import('./stream-searchbox'), { ssr: false })

export default function StreamSearchboxWrapper({ streamId }: { streamId: number }) {
  return <StreamSearchbox streamId={streamId} />
}
