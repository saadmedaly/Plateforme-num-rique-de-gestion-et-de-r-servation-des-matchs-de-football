import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("total_price, status")
      .eq("user_id", userId)

    if (error) throw error

    const total_bookings = bookings.length
    const total_spent = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.total_price || 0), 0)

    return NextResponse.json({
      total_bookings,
      total_spent,
      rating: "4.9",
      badges_count: 5,
      member_since: "2024"
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
