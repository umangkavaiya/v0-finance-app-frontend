import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const updateGoalSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  category: z.string().min(1).optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  status: z.enum(["active", "completed", "paused"]).optional(),
  monthlyContribution: z.number().positive().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json({ goal })
  } catch (error) {
    console.error("Get goal error:", error)
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
    const validatedData = updateGoalSchema.parse(body)

    const goal = await prisma.goal.updateMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
      data: validatedData,
    })

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    const updatedGoal = await prisma.goal.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json({ goal: updatedGoal, message: "Goal updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Update goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const goal = await prisma.goal.deleteMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Goal deleted successfully" })
  } catch (error) {
    console.error("Delete goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
