"use client"

import { useCurrentUser } from "../_hooks/use-current-user"
import EditButton from "./edit-button"

type AdminEditButtonProps = {
  href: string
}

export default function AdminEditButton({ href }: AdminEditButtonProps) {
  const user = useCurrentUser()
  if (!user || !user.admin) return null
  return <EditButton href={href} />
}
