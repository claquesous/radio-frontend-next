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
        <path d="M16.862 5.487a2.25 2.25 0 1 1 3.182 3.182l-9.75 9.75a2 2 0 0 1-.878.513l-4.25 1.062 1.062-4.25a2 2 0 0 1 .513-.878l9.75-9.75z" />
      </svg>
    </Link>
  )
}
