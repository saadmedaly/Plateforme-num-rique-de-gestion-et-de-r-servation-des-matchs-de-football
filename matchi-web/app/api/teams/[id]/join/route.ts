import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params
    const supabase = getServerSupabase()
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
    }

    // 1. Check if team exists
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("id", teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: "الفريق غير موجود" }, { status: 404 })
    }

    // 2. Check if user is already in the team
    const { data: existingMember, error: memberError } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "أنت عضو بالفعل في هذا الفريق" }, { status: 400 })
    }

    // 3. Join the team (as a member)
    const { error: joinError } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        user_id: userId,
        role: 'member'
      })

    if (joinError) {
      console.error("Join team error:", joinError)
      return NextResponse.json({ error: "فشل الانضمام للفريق" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "تم الانضمام بنجاح" })
  } catch (error) {
    console.error("Unexpected join error:", error)
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 })
  }
}
