import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  role: z.enum(["player", "team_owner", "stadium_owner"]).default("player")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const supabase = getServerSupabase()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: validatedData.email,
        password_hash: passwordHash,
        full_name: validatedData.full_name,
        phone: validatedData.phone,
        city: validatedData.city,
        role: validatedData.role,
      })
      .select("id, email, full_name, role")
      .single()

    if (error) {
      console.error("Registration error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to create account", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error" },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

