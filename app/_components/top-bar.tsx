'use client'

import Link from 'next/link'
import LoginForm from './login-form'

export default function TopBar() {
  return (
    <>
      <Link className="py-4 ml-2 text-xl inline-block text-slate-200" href="/">
        Claq Radio
      </Link>
      <div className="inline-block float-right">
        <LoginForm />
      </div>
    </>
  )
}
