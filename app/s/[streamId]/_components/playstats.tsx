import TimeAgo from './timeago'
import type { PlayStats } from '../../../_types/types'

export default function PlayStats({ playStats }: { playStats: PlayStats}) {
  return <div className="w-full sm:w-80 sm:flex-shrink-0 shadow rounded bg-slate-200 dark:bg-slate-700 dark:text-white p-3 mt-4 sm:mt-0">
    <p>Totals Plays: {playStats.play_count}</p>
    <p>Last Played: <TimeAgo date={playStats.last_played_at} /></p>
    <p>Previously Played: <TimeAgo date={playStats.previous_played_at} /></p>
    <p>Last Week Rank: {playStats.last_week_rank}</p>
    <p>All Time Rank: {playStats.rank}</p>
  </div>
}
