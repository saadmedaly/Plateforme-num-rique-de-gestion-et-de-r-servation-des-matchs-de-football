import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("teams")
      .select("*, team_members(user_id, role, joined_at, users(full_name, city))")
      .eq("id", id)
      .single()

    const adaptedTeam = {
      ...data,
      description: data.description || "فريق رياضي متميز",
      wins: data.wins || 0,
      losses: data.losses || 0,
      draws: data.draws || 0,
      ranking: data.ranking || 0
    }

    return NextResponse.json(adaptedTeam)
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
