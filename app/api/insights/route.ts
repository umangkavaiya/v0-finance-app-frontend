import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { generateInsights } from "@/lib/ai-services"

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's recent transactions (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "desc" },
    })

    const insights = await generateInsights(transactions)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Get insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
