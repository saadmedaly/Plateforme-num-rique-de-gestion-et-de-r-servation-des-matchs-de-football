import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const matchSchema = z.object({
  stadium_id: z.string().uuid(),
  home_team_id: z.string().uuid().optional().nullable(),
  away_team_id: z.string().uuid().optional().nullable(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("user_id")

    let query = supabase
      .from("matches")
      .select("*, stadium:stadiums(name, city), home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)")
      .order("date", { ascending: false })

    if (userId) {
      const { data: playerMatches } = await supabase
        .from("match_players")
        .select("match_id")
        .eq("user_id", userId)

      const matchIds = playerMatches?.map((m: any) => m.match_id) || []
      if (matchIds.length === 0) return NextResponse.json([])
      query = query.in("id", matchIds)
    }

    const { data: matches, error } = await query

    if (error) {
      console.error("Fetch matches error:", error)
      return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
    }

    // Adapt data with defaults for missing columns
    const adaptedMatches = (matches || []).map(m => ({
      ...m,
      price: m.price || 30, // Default price
      type: m.type || "5 ضد 5", // Default type
      level: m.level || "متوسط", // Default level
      total_players: m.total_players || 10,
      spots_available: m.spots_available || 4,
      organizer: m.organizer || { full_name: "لاعب" }
    }))

    return NextResponse.json(adaptedMatches)
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
    const validatedData = matchSchema.parse(body)

    const { data: match, error } = await supabase
      .from("matches")
      .insert({ ...validatedData, created_by: userId, status: "scheduled" })
      .select("*, stadium:stadiums(name, city)")
      .single()

    if (error) {
      console.error("Match creation error:", error)
      return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
    }

    return NextResponse.json({ message: "Match created successfully", match }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

