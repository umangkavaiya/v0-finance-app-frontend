import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
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
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Get transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = updateTransactionSchema.parse(body)

    const transaction = await prisma.transaction.updateMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
      data: validatedData,
    })

    if (transaction.count === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json({ transaction: updatedTransaction, message: "Transaction updated successfully" })
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
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const transaction = await prisma.transaction.deleteMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (transaction.count === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
