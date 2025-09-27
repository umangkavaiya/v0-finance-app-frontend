import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { categorizeTransaction } from "@/lib/ai-services"
import { z } from "zod"

const transactionSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["debit", "credit"]),
  category: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const where: any = { userId: user.userId }
    if (category) where.category = category
    if (type) where.type = type

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = transactionSchema.parse(body)

    // Auto-categorize if no category provided
    let category = validatedData.category
    if (!category) {
      const aiResult = await categorizeTransaction(validatedData.description)
      category = aiResult.category
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        category,
        userId: user.userId,
        status: "categorized",
      },
    })

    return NextResponse.json({ transaction, message: "Transaction created successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
