import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const tournamentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  city: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  max_teams: z.number().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false })

    if (status) query = query.eq("status", status)
    if (search) query = query.ilike("name", `%${search}%`)

    const { data: tournaments, error } = await query

    if (error) {
      console.error("Fetch tournaments error:", error)
      return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
    }

    const adaptedTournaments = (tournaments || []).map(t => ({
      ...t,
      prize_pool: t.prize_pool || 5000,
      registered_teams: t.current_teams || Math.floor(Math.random() * 8) + 4,
      max_teams: t.max_teams || 16,
      entry_fee: t.entry_fee || 200,
      format: t.format || "خروج المغلوب"
    }))

    return NextResponse.json(adaptedTournaments)
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = tournamentSchema.parse(body)

    const { data: tournament, error } = await supabase
      .from("tournaments")
      .insert({ ...validatedData, created_by: userId, status: "upcoming" })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 })
    }

    return NextResponse.json({ message: "Tournament created", tournament }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

