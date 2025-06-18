'use client'

import Link from 'next/link'
import LoginForm from './login-form'
import MiniPlayer from './mini-player'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between w-full px-2">
      <Link className="text-xl text-slate-200" href="/">
        Claq Radio
      </Link>

      <div className="flex items-center space-x-4">
        <MiniPlayer />
        <LoginForm />
      </div>
    </div>
  )
}
