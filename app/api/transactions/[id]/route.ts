import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDb, transactions as trxCol, toObjectId, withId } from "@/lib/db"
import { z } from "zod"

const updateTransactionSchema = z.object({
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  category: z.string().optional(),
  type: z.enum(["debit", "credit"]).optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const db = await getDb()
    const col = trxCol(db)
    const doc = await col.findOne({ _id: toObjectId(params.id), userId: user.userId })
    if (!doc) return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    return NextResponse.json({ transaction: withId(doc) })
  } catch (error) {
    console.error("Get transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const validated = updateTransactionSchema.parse(body)

    const db = await getDb()
    const col = trxCol(db)

    const res = await col.updateOne({ _id: toObjectId(params.id), userId: user.userId }, { $set: validated })
    if (res.matchedCount === 0) return NextResponse.json({ error: "Transaction not found" }, { status: 404 })

    const updated = await col.findOne({ _id: toObjectId(params.id) })
    return NextResponse.json({ transaction: withId(updated!), message: "Transaction updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("Update transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const db = await getDb()
    const col = trxCol(db)
    const res = await col.deleteOne({ _id: toObjectId(params.id), userId: user.userId })
    if (res.deletedCount === 0) return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
