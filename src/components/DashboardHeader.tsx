"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardHeaderProps {
  userEmail: string
}

export default function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const handleSignOut = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
    }

    router.push("/sign-in")

    console.log("TODO: Implement sign out")
    setLoading(false)
  }

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold">Task Manager</h2>
              <p className="text-slate-400 text-sm">{userEmail}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all disabled:opacity-50"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </header>
  )
}
