import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("stadiums")
      .select("*, owner:users!owner_id(full_name, phone)")
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Stadium not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
