"use client"

import { useState } from "react"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => Promise<void>
  onToggleComplete: (id: string, completed: boolean) => Promise<void>
}

export default function TaskItem({
  task,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(task.id)
    } catch {
      setDeleting(false)
    }
  }

  const handleToggle = async () => {
    setToggling(true)
    try {
      await onToggleComplete(task.id, !task.completed)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all">
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={toggling || deleting}
          className="mt-1 shrink-0 w-5 h-5 rounded border-2 border-white/30 hover:border-blue-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: task.completed
              ? "rgb(59, 130, 246)"
              : "transparent",
            borderColor: task.completed ? "rgb(59, 130, 246)" : undefined,
          }}
        >
          {task.completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium mb-1 ${
              task.completed ? "text-slate-500 line-through" : "text-white"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm mb-2 ${
                task.completed ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {task.description}
            </p>
          )}
          <p className="text-xs text-slate-500">
            {new Date(task.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting || toggling}
          className="shrink-0 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
