import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { processFinBotQuery } from "@/lib/ai-services"
import { z } from "zod"

const finbotSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message } = finbotSchema.parse(body)

    // Get user's recent transactions and goals
    const [transactions, goals] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: user.userId },
        orderBy: { date: "desc" },
        take: 100,
      }),
      prisma.goal.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const response = await processFinBotQuery(message, user.userId, transactions, goals)

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("FinBot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
