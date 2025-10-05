import { type NextRequest, NextResponse } from "next/server"
import { getDb, users, withId } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(13).max(120),
  password: z.string().min(6),
})

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const db = await getDb()
    const col = users(db)

    const existing = await col.findOne({ email: data.email })
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashed = await hashPassword(data.password)
    const doc = {
      fullName: data.fullName,
      email: data.email,
      age: data.age,
      password: hashed,
      currency: "INR",
      timezone: "Asia/Kolkata",
      createdAt: new Date(),
    }
    const res = await col.insertOne(doc)
    const inserted = await col.findOne({ _id: res.insertedId })

    const safe = withId(inserted)
    const token = generateToken(safe!.id as string)

    return NextResponse.json({ user: safe, token, message: "Account created successfully" })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 })
    }
    console.error("[v0] Register error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
