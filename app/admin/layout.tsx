import React from 'react'
import Link from 'next/link'
import MobileSidebarLayout from '../_components/mobile-sidebar-layout'

const navItems = [
  {
    href: '/admin/songs',
    label: 'Songs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/artists',
    label: 'Artists',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: '/admin/albums',
    label: 'Albums',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
        <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zm0 0v3m-3-1h6M12 12a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarLayout
      title="Admin"
      navItems={navItems}
      footer={
        <Link
          href="/admin/songs/new"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Song
        </Link>
      }
    >
      {children}
    </MobileSidebarLayout>
  )
}
