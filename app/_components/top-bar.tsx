'use client'

import Link from 'next/link'
import LoginForm from './login-form'
import MiniPlayer from './mini-player'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-2 sm:px-4">
      <Link className="text-xl text-slate-200 flex-shrink-0" href="/">
        Claq Radio
      </Link>

      <div className="flex items-center space-x-4">
        <MiniPlayer />
        <LoginForm />
      </div>
    </div>
  )
}
