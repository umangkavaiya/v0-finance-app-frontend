import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const updateSettingsSchema = z.object({
  fullName: z.string().min(2).optional(),
  age: z.number().min(13).max(120).optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        currency: true,
        timezone: true,
        createdAt: true,
      },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = updateSettingsSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: validatedData,
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        currency: true,
        timezone: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user: updatedUser, message: "Settings updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
