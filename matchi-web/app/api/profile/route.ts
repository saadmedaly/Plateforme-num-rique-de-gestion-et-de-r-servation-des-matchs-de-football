import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const updateSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  avatar_url: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const userId = request.nextUrl.searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, phone, city, avatar_url, role, created_at")
      .eq("id", userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    const { data, error } = await supabase
      .from("users")
      .update(validatedData)
      .eq("id", userId)
      .select("id, email, full_name, phone, city, avatar_url, role")
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile updated", user: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

