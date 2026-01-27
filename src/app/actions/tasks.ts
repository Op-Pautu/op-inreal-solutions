"use server"

import { createClient } from "@/lib/supabase/server"
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task"

export async function getTasks() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data as Task[]
}

export async function createTask(input: CreateTaskInput) {
  console.log("TODO: Implement createTask", input)
  throw new Error("Not implemented")
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  console.log("TODO: Implement updateTask", id, input)
  throw new Error("Not implemented")
}

export async function deleteTask(id: string) {
  console.log("TODO: Implement deleteTask", id)
  throw new Error("Not implemented")
}
