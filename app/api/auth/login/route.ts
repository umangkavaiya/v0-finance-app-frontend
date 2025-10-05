import { type NextRequest, NextResponse } from "next/server"
import { getDb, users, withId } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = loginSchema.parse(body)

    const db = await getDb()
    const col = users(db)

    const user = await col.findOne({ email: data.email })
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const ok = await verifyPassword(data.password, user.password)
    if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const safe = withId(user)
    const token = generateToken(safe!.id as string)
    return NextResponse.json({ user: safe, token, message: "Login successful" })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 })
    }
    console.error("[v0] Login error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
