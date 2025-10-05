import { GoogleGenerativeAI } from "@google/generative-ai"
import type { TransactionDoc, GoalDoc } from "@/lib/db"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// AI Transaction Categorizer Service
export async function categorizeTransaction(description: string): Promise<{ category: string; confidence: number }> {
  // Rule-based system for high-confidence matches
  const rules = [
    {
      keywords: ["swiggy", "zomato", "food", "restaurant", "cafe", "pizza", "burger"],
      category: "Food & Dining",
      confidence: 95,
    },
    {
      keywords: ["uber", "ola", "taxi", "bus", "metro", "petrol", "fuel", "transport"],
      category: "Transportation",
      confidence: 95,
    },
    { keywords: ["amazon", "flipkart", "shopping", "mall", "store", "purchase"], category: "Shopping", confidence: 90 },
    {
      keywords: ["movie", "cinema", "netflix", "spotify", "entertainment", "game"],
      category: "Entertainment",
      confidence: 90,
    },
    {
      keywords: ["electricity", "water", "gas", "internet", "mobile", "bill", "utility"],
      category: "Bills & Utilities",
      confidence: 95,
    },
    { keywords: ["hospital", "doctor", "medicine", "pharmacy", "health"], category: "Healthcare", confidence: 90 },
    { keywords: ["school", "college", "course", "book", "education"], category: "Education", confidence: 90 },
    { keywords: ["salary", "income", "bonus", "freelance"], category: "Income", confidence: 95 },
  ]

  const lowerDesc = description.toLowerCase()

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return { category: rule.category, confidence: rule.confidence }
    }
  }

  // If no rule matches, use LLM
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `Analyze the following transaction description and suggest the most likely category from this list: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Income', 'Other']. Return only a single JSON object with two keys: 'category' and 'confidence' (a number between 0 and 100). Description: '${description}'`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const parsed = JSON.parse(text)
      return {
        category: parsed.category || "Other",
        confidence: Math.min(Math.max(parsed.confidence || 50, 0), 100),
      }
    } catch {
      return { category: "Other", confidence: 30 }
    }
  } catch (error) {
    console.error("AI categorization failed:", error)
    return { category: "Other", confidence: 30 }
  }
}

// AI Financial Insights Generator
export async function generateInsights(transactions: TransactionDoc[]): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `You are FinBuddy, an expert financial advisor. Analyze the user's following transactions: ${JSON.stringify(
      transactions.slice(0, 50),
    )}. Provide three short, personalized, and actionable insights. One should be positive encouragement, one a warning or area for improvement, and one a helpful suggestion. Return the response as a JSON array of strings.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed)
        ? parsed
        : [
            "Keep tracking your expenses for better insights!",
            "Consider setting up a monthly budget.",
            "Review your spending categories regularly.",
          ]
    } catch {
      return [
        "Keep tracking your expenses for better insights!",
        "Consider setting up a monthly budget.",
        "Review your spending categories regularly.",
      ]
    }
  } catch (error) {
    console.error("AI insights generation failed:", error)
    return [
      "Keep tracking your expenses for better insights!",
      "Consider setting up a monthly budget.",
      "Review your spending categories regularly.",
    ]
  }
}

// Fin-Bot Conversational Service
export async function processFinBotQuery(
  message: string,
  userId: string,
  transactions: TransactionDoc[],
  goals: GoalDoc[],
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const intentPrompt = `Classify the user's request into one of the following intents: 'spending_summary', 'goal_progress', 'savings_tips', 'budget_status', or 'general_query'. User request: '${message}'. Return only the intent name as a string.`
    const intentResult = await model.generateContent(intentPrompt)
    const intent = (await intentResult.response.text()).trim().toLowerCase()

    let responseData: any = {}
    let responseMessage = ""

    switch (intent) {
      case "spending_summary": {
        const categoryTotals = transactions.reduce(
          (acc, t) => {
            if (t.type === "debit") {
              acc[t.category] = (acc[t.category] || 0) + t.amount
            }
            return acc
          },
          {} as Record<string, number>,
        )

        const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
        const categories = Object.entries(categoryTotals)
          .map(([name, amount]) => ({
            name,
            amount,
            percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
          }))
          .sort((a, b) => b.amount - a.amount)

        responseData = { type: "spending_summary", categories, totalSpent }
        responseMessage = `Here's your spending summary. You've spent ₹${totalSpent.toLocaleString()} this month across ${categories.length} categories.`
        break
      }
      case "goal_progress": {
        const activeGoals = goals.filter((g) => g.status === "active")
        responseData = {
          type: "goal_progress",
          goals: activeGoals.map((g) => ({
            name: g.name,
            progress: Math.round((g.currentAmount / g.targetAmount) * 100),
            remaining: g.targetAmount - g.currentAmount,
          })),
        }
        responseMessage = `You have ${activeGoals.length} active goals. Here's your progress overview.`
        break
      }
      default: {
        const generalPrompt = `You are FinBuddy, a helpful financial assistant. Answer this question: "${message}". Keep the response concise and helpful.`
        const generalResult = await model.generateContent(generalPrompt)
        responseMessage = await generalResult.response.text()
        responseData = { type: "general_query" }
      }
    }

    return {
      message: responseMessage,
      suggestions: ["How can I save more money?", "Show my spending trends", "What are my biggest expenses?"],
      data: responseData,
    }
  } catch (error) {
    console.error("FinBot query processing failed:", error)
    return {
      message: "I'm having trouble processing your request right now. Please try again later.",
      suggestions: ["How can I save more money?", "Show my spending trends", "What are my biggest expenses?"],
      data: { type: "error" },
    }
  }
}
