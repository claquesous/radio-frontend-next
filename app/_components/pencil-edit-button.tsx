"use client"

import { useCurrentUser } from "../_hooks/use-current-user"
import Link from "next/link"

type PencilEditButtonProps = {
  href: string
}

export default function PencilEditButton({ href }: PencilEditButtonProps) {
  const user = useCurrentUser()
  if (!user || !user.admin) return null

  return (
    <Link
      href={href}
      className="absolute right-3 top-1"
      title="Edit"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 hover:text-blue-500 transition-colors" style={{ display: "inline", verticalAlign: "middle" }}>
        <rect x="9" y="5" width="6" height="12" rx="1" />
        <polygon points="12,2 8,5 16,5" />
      </svg>
    </Link>
  )
}
