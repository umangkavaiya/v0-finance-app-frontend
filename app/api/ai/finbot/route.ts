import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { processFinBotQuery } from "@/lib/ai-services"
import { getDb, transactions as trxCol, goals as goalsCol } from "@/lib/db"
import { z } from "zod"

const finbotSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { message } = finbotSchema.parse(body)

    const db = await getDb()
    const [tx, gs] = await Promise.all([
      trxCol(db).find({ userId: user.userId }).sort({ date: -1 }).limit(100).toArray(),
      goalsCol(db).find({ userId: user.userId }).sort({ createdAt: -1 }).toArray(),
    ])

    const response = await processFinBotQuery(message, user.userId, tx, gs)
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("FinBot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
