import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { categorizeTransaction } from "@/lib/ai-services"
import Papa from "papaparse"

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 })
    }

    const csvText = await file.text()
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })

    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 })
    }

    const transactions = []
    const categorizedTransactions = []

    // Process each row
    for (const row of parsed.data as any[]) {
      try {
        const transaction = {
          date: new Date(row.date || row.Date),
          description: row.description || row.Description || "",
          amount: Math.abs(Number.parseFloat(row.amount || row.Amount || "0")),
          type: Number.parseFloat(row.amount || row.Amount || "0") < 0 ? "debit" : "credit",
          userId: user.userId,
          status: "pending",
          category: "Other",
        }

        if (transaction.description && transaction.amount > 0) {
          transactions.push(transaction)
        }
      } catch (error) {
        console.error("Error processing row:", row, error)
      }
    }

    if (transactions.length === 0) {
      return NextResponse.json({ error: "No valid transactions found in CSV" }, { status: 400 })
    }

    // Create transactions in database
    const createdTransactions = await prisma.transaction.createMany({
      data: transactions,
    })

    // Get the created transactions for categorization
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.userId,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
      take: transactions.length,
    })

    // Categorize transactions using AI
    for (const transaction of pendingTransactions) {
      try {
        const aiResult = await categorizeTransaction(transaction.description)
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            category: aiResult.category,
            status: "categorized",
          },
        })
        categorizedTransactions.push({
          ...transaction,
          category: aiResult.category,
          confidence: aiResult.confidence,
        })
      } catch (error) {
        console.error("Error categorizing transaction:", transaction.id, error)
      }
    }

    return NextResponse.json({
      message: `Successfully uploaded and categorized ${transactions.length} transactions`,
      count: transactions.length,
      categorized: categorizedTransactions.length,
    })
  } catch (error) {
    console.error("CSV upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
