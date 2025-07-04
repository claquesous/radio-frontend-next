// useCurrentUser hook for React

import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  admin: boolean
}

export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  return user
}
