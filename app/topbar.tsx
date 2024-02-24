import Link from 'next/link'
import Searchbox from './searchbox'

export default function TopBar() {
  return <div>
    <Link href="/">ClaqRadio</Link>
    <Searchbox />
  </div>
}

