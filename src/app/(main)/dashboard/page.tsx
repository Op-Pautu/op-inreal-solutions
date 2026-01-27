import { getTasks } from "@/app/actions/tasks"
import { createClient } from "@/lib/supabase/server"
import TaskList from "@/components/TaskList"
import DashboardHeader from "@/components/DashboardHeader"
import { Task } from "@/types/task"

export default async function Dashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userEmail = user?.email || "user@mail.com"

  const tasks: Task[] = await getTasks()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader userEmail={userEmail} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-slate-400">Manage your daily tasks efficiently</p>
        </div>

        <TaskList initialTasks={tasks} />
      </main>
    </div>
  )
}
