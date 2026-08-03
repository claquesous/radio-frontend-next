import React from 'react'
import Link from 'next/link'

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
    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="w-52 flex-shrink-0 flex flex-col bg-slate-800/50 border-r border-slate-700/60">
        <div className="px-5 py-6 border-b border-slate-700/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Manage</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors group"
            >
              <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Radio
          </Link>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-6xl">
          {children}
        </div>
      </main>

      <p id="alert" className="sr-only" />
    </div>
  )
}
