import { createClient } from "@/lib/supabase/server"
import DashboardHeader from "@/components/DashboardHeader"

export default async function Dashboard() {
  const supabase = await createClient()
  const userData = (await supabase.auth.getUser()).data
  const userEmail = userData.user?.email || "user@mail.com"

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader userEmail={userEmail} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-slate-400">Manage your daily tasks efficiently</p>
        </div>
      </main>
    </div>
  )
}
