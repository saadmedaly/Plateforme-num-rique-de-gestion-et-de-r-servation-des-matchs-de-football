import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const teamSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  logo_url: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    
    const body = await request.json()
    const validatedData = teamSchema.parse(body)

    // Get user ID from headers (would come from auth session)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    // Create team
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: validatedData.name,
        city: validatedData.city,
        logo_url: validatedData.logo_url,
        created_by: userId
      })
      .select()
      .single()

    if (error) {
      console.error("Team creation error:", error)
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      )
    }

    // Add creator as team member with captain role
    await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: userId,
      role: "captain"
    })

    return NextResponse.json({
      message: "Team created successfully",
      team
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error" },
        { status: 400 }
      )
    }

    console.error("Error in teams API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get("city")
    const userId = searchParams.get("user_id")

    let query = supabase
      .from("teams")
      .select("*, team_members(user_id), creator:users!created_by(full_name)")

    if (city) {
      query = query.eq("city", city)
    }

    if (userId) {
      // Get teams where user is a member
      const { data: memberships } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", userId)
      
      const teamIds = memberships?.map(m => m.team_id) || []
      if (teamIds.length > 0) {
        query = query.in("id", teamIds)
      } else {
        return NextResponse.json([])
      }
    }

    const { data: teams, error } = await query.order("ranking", { ascending: false })

    if (error) {
      console.error("Error fetching teams:", error)
      return NextResponse.json(
        { error: "Failed to fetch teams" },
        { status: 500 }
      )
    }

    const adaptedTeams = (teams || []).map(t => ({
      ...t,
      description: t.description || "فريق رياضي طموح",
      member_count: t.member_count || (t.team_members?.length || 1),
      wins: t.wins || 0,
      losses: t.losses || 0,
      draws: t.draws || 0,
      points: (t.wins || 0) * 3 + (t.draws || 0)
    }))

    return NextResponse.json(adaptedTeams)

  } catch (error) {
    console.error("Error in teams API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

