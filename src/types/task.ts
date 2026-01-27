export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export type CreateTaskInput = Pick<Task, "title" | "description">
export type UpdateTaskInput = Partial<CreateTaskInput> & { completed?: boolean }
