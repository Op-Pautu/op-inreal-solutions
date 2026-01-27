import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  // TODO: Implement redirect logic
  // 1. Get the Supabase server client using: await createClient()
  // 2. Get the current user using: await supabase.auth.getUser()
  // 3. If user exists, redirect to "/dashboard"
  // 4. If no user, redirect to "/sign-in"

  // Hint: Use redirect() function from next/navigation
  // Hint: Check if user exists with: if (user) { ... }

  redirect("/sign-in")
}
