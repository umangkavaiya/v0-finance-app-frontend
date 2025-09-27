import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Register API called")

    const body = await request.json()
    console.log("[v0] Request body received:", { ...body, password: "[REDACTED]" })

    const validatedData = registerSchema.parse(body)
    console.log("[v0] Data validation successful")

    // Test database connection first
    await prisma.$connect()
    console.log("[v0] Database connected")

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    console.log("[v0] Existing user check completed")

    if (existingUser) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password)
    console.log("[v0] Password hashed")

    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        age: validatedData.age,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        currency: true,
        timezone: true,
        createdAt: true,
      },
    })
    console.log("[v0] User created successfully")

    const token = generateToken(user.id)
    console.log("[v0] Token generated")

    return NextResponse.json({
      user,
      token,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
      }
      if (error.message.includes("table") || error.message.includes("relation")) {
        return NextResponse.json({ error: "Database not initialized. Please run database setup." }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
