import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDb, transactions as trxCol } from "@/lib/db"
import { generateInsights } from "@/lib/ai-services"

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const db = await getDb()
    const col = trxCol(db)
    const docs = await col
      .find({ userId: user.userId, date: { $gte: thirtyDaysAgo } })
      .sort({ date: -1 })
      .toArray()

    const insights = await generateInsights(docs)
    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Get insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
