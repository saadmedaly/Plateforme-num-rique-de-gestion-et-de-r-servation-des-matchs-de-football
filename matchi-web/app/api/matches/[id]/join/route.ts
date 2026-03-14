import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: matchId } = await params
    const supabase = getServerSupabase()
    
    // In a real app, we get the user from the session. 
    // Since we are mocking/testing, we might expect a user ID in the request or headers
    // For now, let's try to get it from headers or a mock
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. User ID required." }, { status: 401 })
    }

    // 1. Check if match exists
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("id, total_players")
      .eq("id", matchId)
      .single()

    if (matchError || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // 2. Check if user is already in the match
    const { data: existingPlayer, error: playerError } = await supabase
      .from("match_players")
      .select("id")
      .eq("match_id", matchId)
      .eq("user_id", userId)
      .single()

    if (existingPlayer) {
      return NextResponse.json({ error: "Already joined this match" }, { status: 400 })
    }

    // 3. Count current players to ensure there's space
    const { count, error: countError } = await supabase
      .from("match_players")
      .select("*", { count: 'exact', head: true })
      .eq("match_id", matchId)

    const totalAllowed = (match as any).total_players || 10
    if (count !== null && count >= totalAllowed) {
      return NextResponse.json({ error: "Match is full" }, { status: 400 })
    }

    // 4. Join the match
    const { error: joinError } = await supabase
      .from("match_players")
      .insert({
        match_id: matchId,
        user_id: userId
      })

    if (joinError) {
      console.error("Join match error:", joinError)
      return NextResponse.json({ error: "Failed to join match" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Joined successfully" })
  } catch (error) {
    console.error("Unexpected join error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
