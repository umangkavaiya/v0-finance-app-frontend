import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDb, goals as goalsCol, withId, manyWithId } from "@/lib/db"
import { z } from "zod"

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  description: z.string().min(1, "Description is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().min(0, "Current amount cannot be negative").optional(),
  deadline: z.string().transform((str) => new Date(str)),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["high", "medium", "low"]),
  monthlyContribution: z.number().positive("Monthly contribution must be positive"),
})

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const db = await getDb()
    const col = goalsCol(db)
    const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ goals: manyWithId(items) })
  } catch (error) {
    console.error("Get goals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const validated = goalSchema.parse(body)

    const db = await getDb()
    const col = goalsCol(db)
    const doc = {
      userId: user.userId,
      ...validated,
      currentAmount: validated.currentAmount ?? 0,
      status: "active" as const,
      createdAt: new Date(),
    }
    const res = await col.insertOne(doc)
    const inserted = await col.findOne({ _id: res.insertedId })
    return NextResponse.json({ goal: withId(inserted!), message: "Goal created successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("Create goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
