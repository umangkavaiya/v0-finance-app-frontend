import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { categorizeTransaction } from "@/lib/ai-services"
import { getDb, transactions as trxCol, manyWithId } from "@/lib/db"
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
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const db = await getDb()
    const col = trxCol(db)

    const query: any = { userId: user.userId }
    if (category) query.category = category
    if (type) query.type = type

    const items = await col.find(query).sort({ date: -1 }).limit(limit).toArray()
    return NextResponse.json({ transactions: manyWithId(items) })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const validated = transactionSchema.parse(body)

    let category = validated.category
    if (!category) {
      const ai = await categorizeTransaction(validated.description)
      category = ai.category
    }

    const db = await getDb()
    const col = trxCol(db)

    const doc = {
      userId: user.userId,
      date: validated.date,
      description: validated.description,
      amount: validated.amount,
      type: validated.type,
      category: category || "Other",
      status: "categorized" as const,
      createdAt: new Date(),
    }
    const res = await col.insertOne(doc)
    const inserted = await col.findOne({ _id: res.insertedId })

    return NextResponse.json({
      transaction: inserted ? { id: inserted._id.toString(), ...doc } : null,
      message: "Transaction created successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
