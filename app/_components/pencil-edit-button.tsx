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
        <polygon points="7,18 17,14 17,7 7,11" />
        <polygon points="17,7 20,5 10,9 7,11" />
      </svg>
    </Link>
  )
}
