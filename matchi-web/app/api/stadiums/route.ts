import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get("city")
    const surface_type = searchParams.get("surface_type")
    const size = searchParams.get("size")
    const min_price = searchParams.get("min_price")
    const max_price = searchParams.get("max_price")
    const search = searchParams.get("search")

    let query = supabase
      .from("stadiums")
      .select("*")
      .eq("is_active", true)

    if (city) {
      query = query.eq("city", city)
    }

    if (surface_type) {
      query = query.eq("surface_type", surface_type)
    }

    if (size) {
      query = query.eq("size", size)
    }

    if (min_price) {
      query = query.gte("price_per_hour", parseFloat(min_price))
    }

    if (max_price) {
      query = query.lte("price_per_hour", parseFloat(max_price))
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query.order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching stadiums:", error)
      return NextResponse.json(
        { error: "Failed to fetch stadiums" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error("Error in stadiums API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

