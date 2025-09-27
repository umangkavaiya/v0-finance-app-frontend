import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    // Test database connection
    await prisma.$connect()
    console.log("[v0] Database connected successfully")

    // Test if tables exist by trying to count users
    const userCount = await prisma.user.count()
    console.log("[v0] User count:", userCount)

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount,
    })
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
