import { NextResponse } from "next/server"
import { getDb, users } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Testing MongoDB connection...")
    const db = await getDb()
    const count = await users(db).countDocuments()
    console.log("[v0] MongoDB connected. Users:", count)
    return NextResponse.json({ status: "success", message: "MongoDB connection successful", userCount: count })
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    )
  }
}
