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
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="currentColor" viewBox="0 0 20 20" className="text-slate-400 hover:text-blue-500 transition-colors" style={{ display: "inline", verticalAlign: "middle" }}>
        <path d="M17.211 2.789a2.25 2.25 0 0 0-3.182 0l-8.25 8.25a2 2 0 0 0-.513.878l-1.062 4.25a.75.75 0 0 0 .92.92l4.25-1.062a2 2 0 0 0 .878-.513l8.25-8.25a2.25 2.25 0 0 0 0-3.182Zm-2.475 1.414a.75.75 0 1 1 1.06 1.06l-.53.53-1.06-1.06.53-.53ZM4.75 12.31l6.56-6.56 1.06 1.06-6.56 6.56-1.06-1.06Zm-.53 1.53 1.06 1.06-2.12.53.53-2.12Zm2.12 1.06-1.06-1.06 6.56-6.56 1.06 1.06-6.56 6.56Z" />
      </svg>
    </Link>
  )
}
