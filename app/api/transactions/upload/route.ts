import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { categorizeTransaction } from "@/lib/ai-services"
import { getDb, transactions as trxCol, type toObjectId } from "@/lib/db"
import Papa from "papaparse"

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 })
    }

    const csvText = await file.text()
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })
    if (parsed.errors.length > 0) return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 })

    const docs: any[] = []
    for (const row of parsed.data as any[]) {
      try {
        const amount = Number.parseFloat(row.amount || row.Amount || "0")
        const description = row.description || row.Description || ""
        const date = new Date(row.date || row.Date)
        if (!description || !amount || Number.isNaN(amount) || isNaN(date.getTime())) continue
        docs.push({
          userId: user.userId,
          date,
          description,
          amount: Math.abs(amount),
          type: amount < 0 ? "debit" : "credit",
          status: "pending",
          category: "Other",
          createdAt: new Date(),
        })
      } catch {
        // skip bad row
      }
    }

    if (docs.length === 0) return NextResponse.json({ error: "No valid transactions found in CSV" }, { status: 400 })

    const db = await getDb()
    const col = trxCol(db)
    const insertRes = await col.insertMany(docs)

    const insertedIds = Object.values(insertRes.insertedIds).map((id) => id as unknown as ReturnType<typeof toObjectId>)
    const pending = await col.find({ _id: { $in: insertedIds } }).toArray()

    let categorized = 0
    for (const t of pending) {
      try {
        const ai = await categorizeTransaction(t.description)
        await col.updateOne({ _id: t._id }, { $set: { category: ai.category, status: "categorized" } })
        categorized++
      } catch (e) {
        console.error("Categorization error:", e)
      }
    }

    return NextResponse.json({
      message: `Successfully uploaded and categorized ${docs.length} transactions`,
      count: docs.length,
      categorized,
    })
  } catch (error) {
    console.error("CSV upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
