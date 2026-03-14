import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase()

    const { data: match, error } = await supabase
      .from("matches")
      .select("*, stadium:stadiums(name, city), organizer:users!created_by(full_name, avatar_url)")
      .eq("id", id)
      .single()

    if (error || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Add defaults for missing columns
    const adaptedMatch = {
      ...match,
      price: match.price || 30,
      type: match.type || "5 ضد 5",
      level: match.level || "متوسط",
      total_players: match.total_players || 10,
      spots_available: match.spots_available || 4,
      players: match.players || [] // For now return empty or mock if needed
    }

    return NextResponse.json(adaptedMatch)
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
