import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDb, users as usersCol, withId } from "@/lib/db"
import { z } from "zod"

const updateSettingsSchema = z.object({
  fullName: z.string().min(2).optional(),
  age: z.number().min(13).max(120).optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const db = await getDb()
    const col = usersCol(db)
    const doc = await col.findOne({ _id: new (await import("mongodb")).ObjectId(user.userId) }).catch(async () => {
      // fallback: lookup by stored id string to keep compatibility
      return await col.findOne({ id: user.userId })
    })

    // If we didn't store ObjectId as id, try email-based lookup via token flows (optional)
    const userProfile = doc ? withId(doc) : null
    if (!userProfile) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const validated = updateSettingsSchema.parse(body)

    const db = await getDb()
    const col = usersCol(db)
    const { ObjectId } = await import("mongodb")
    await col.updateOne({ _id: new ObjectId(user.userId) }, { $set: validated })
    const updated = await col.findOne({ _id: new ObjectId(user.userId) })
    return NextResponse.json({ user: withId(updated!), message: "Settings updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
