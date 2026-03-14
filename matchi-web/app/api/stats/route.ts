import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getServerSupabase()

    const [tournaments, teams, matches, players] = await Promise.all([
      supabase.from("tournaments").select("*", { count: "exact", head: true }),
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      tournaments: tournaments.count ?? 0,
      teams: teams.count ?? 0,
      matches: matches.count ?? 0,
      players: players.count ?? 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

