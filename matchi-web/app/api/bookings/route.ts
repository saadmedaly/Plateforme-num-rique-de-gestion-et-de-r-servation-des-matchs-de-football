import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const bookingSchema = z.object({
  stadium_id: z.string().uuid(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  total_price: z.number(),
  payment_method: z.string().optional(),
  notes: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check for booking conflicts
    const { data: conflictingBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("stadium_id", validatedData.stadium_id)
      .eq("date", validatedData.date)
      .eq("status", "confirmed")
      .or(`and(start_time.lt.${validatedData.end_time},end_time.gt.${validatedData.start_time})`)

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      )
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        stadium_id: validatedData.stadium_id,
        user_id: userId,
        date: validatedData.date,
        start_time: validatedData.start_time,
        end_time: validatedData.end_time,
        total_price: validatedData.total_price,
        payment_method: validatedData.payment_method || 'card',
        notes: validatedData.notes,
        status: 'pending',
        payment_status: 'unpaid'
      })
      .select("*, stadiums(name, city)")
      .single()

    if (error) {
      console.error("Booking error:", error)
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email/notification
    // TODO: Process payment if needed

    return NextResponse.json({
      message: "Booking created successfully",
      booking
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error" },
        { status: 400 }
      )
    }

    console.error("Error in bookings API:", error)
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
    const userId = searchParams.get("user_id")
    const stadiumId = searchParams.get("stadium_id")
    const status = searchParams.get("status")

    let query = supabase.from("bookings").select("*, stadiums(name, city), users(full_name)")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (stadiumId) {
      query = query.eq("stadium_id", stadiumId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error("Error in bookings API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

