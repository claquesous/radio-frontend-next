'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface MobileSidebarLayoutProps {
  title: string
  navItems: NavItem[]
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function MobileSidebarLayout({ title, navItems, footer, children }: MobileSidebarLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-full flex-shrink-0 flex flex-col bg-slate-900 lg:border-r border-slate-700/60 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:w-52 lg:bg-slate-800/50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-slate-700/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-2 -mr-2 rounded hover:bg-slate-700/60"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
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

        {footer && <div className="px-3 pb-6 space-y-2">{footer}</div>}
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-700/60 bg-slate-800/50 sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 rounded hover:bg-slate-700/60"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      <p id="alert" className="sr-only" />
    </div>
  )
}
