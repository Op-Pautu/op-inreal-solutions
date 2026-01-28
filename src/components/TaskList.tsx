"use client"
import { useState, useOptimistic, startTransition } from "react"
import { createTask, deleteTask, updateTask } from "@/app/actions/tasks"
import type { Task } from "@/types/task"
import TaskItem from "./TaskItem"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (
      state,
      newValue:
        | Task
        | { id: string; action: "delete" | "update"; updates?: Partial<Task> },
    ) => {
      if ("action" in newValue) {
        if (newValue.action === "delete") {
          return state.filter((task) => task.id !== newValue.id)
        }
        if (newValue.action === "update") {
          return state.map((task) =>
            task.id === newValue.id ? { ...task, ...newValue.updates } : task,
          )
        }
      }
      return [newValue as Task, ...state]
    },
  )

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError(null)

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || null,
      completed: false,
      user_id: "temp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    startTransition(() => {
      addOptimisticTask(optimisticTask)
    })

    setTitle("")
    setDescription("")

    try {
      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || null,
      })

      startTransition(() => {
        setTasks((currentTasks) => [newTask, ...currentTasks])
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")

      // Rollback: remove the optimistic temp task
      startTransition(() => {
        addOptimisticTask({ id: optimisticTask.id, action: "delete" })
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    // Find the task to potentially revert
    const taskToDelete = optimisticTasks.find((t) => t.id === id)
    if (!taskToDelete) return

    startTransition(() => {
      addOptimisticTask({ id, action: "delete" })
    })

    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task")

      // Rollback: add the task back optimistically
      startTransition(() => {
        addOptimisticTask(taskToDelete)
      })
    }
  }

  const handleToggleComplete = async (id: string, newCompleted: boolean) => {
    startTransition(() => {
      addOptimisticTask({
        id,
        action: "update",
        updates: { completed: newCompleted },
      })
    })

    try {
      await updateTask(id, { completed: newCompleted })
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: newCompleted } : task,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")

      // Rollback: revert to previous completed state
      startTransition(() => {
        addOptimisticTask({
          id,
          action: "update",
          updates: { completed: !newCompleted },
        })
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Task Form */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create New Task
        </h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {optimisticTasks.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
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
            <h3 className="text-lg font-medium text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-400">
              Create your first task to get started
            </p>
          </div>
        ) : (
          optimisticTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  )
}
