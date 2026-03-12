"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/admin/login")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcc56c] mx-auto"></div>
          <p className="mt-4 text-[#4a5c52]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}
