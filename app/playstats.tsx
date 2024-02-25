import TimeAgo from './timeago'

export default function PlayStats({params}) {
  return <div className="w-80 shadow rounded bg-slate-200 p-3 float-right">
    <p>Totals Plays: {params.play_count}</p>
    <p>Last Played: <TimeAgo date={params.last_played_at} /></p>
    <p>Previously Played: <TimeAgo date={params.previous_played_at} /></p>
    <p>Last Week Rank: {params.last_week_rank}</p>
    <p>All Time Rank: {params.rank}</p>
  </div>
}

