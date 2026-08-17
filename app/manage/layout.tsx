import React from 'react'
import Link from 'next/link'
import MobileSidebarLayout from '../_components/mobile-sidebar-layout'

const navItems = [
  {
    href: '/manage',
    label: 'My Streams',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
        <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    href: '/manage/streams/new',
    label: 'New Stream',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
]

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarLayout
      title="Manage"
      navItems={navItems}
      footer={
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Radio
        </Link>
      }
    >
      {children}
    </MobileSidebarLayout>
  )
}
