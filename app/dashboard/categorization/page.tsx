"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Check, X, Sparkles, IndianRupee } from "lucide-react"

interface PendingTransaction {
  id: string
  date: string
  description: string
  amount: number
  suggestedCategory: string
  confidence: number
  alternativeCategories: string[]
}

export default function CategorizationPage() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([
    {
      id: "1",
      date: "2024-01-16",
      description: "AMAZON.IN PURCHASE",
      amount: -2500,
      suggestedCategory: "Shopping",
      confidence: 95,
      alternativeCategories: ["Electronics", "Books & Media"],
    },
    {
      id: "2",
      date: "2024-01-15",
      description: "PETROL PUMP PAYMENT",
      amount: -3200,
      suggestedCategory: "Transportation",
      confidence: 88,
      alternativeCategories: ["Vehicle Maintenance", "Fuel"],
    },
    {
      id: "3",
      date: "2024-01-14",
      description: "MEDICAL STORE",
      amount: -850,
      suggestedCategory: "Healthcare",
      confidence: 92,
      alternativeCategories: ["Pharmacy", "Personal Care"],
    },
    {
      id: "4",
      date: "2024-01-13",
      description: "FREELANCE PAYMENT",
      amount: 15000,
      suggestedCategory: "Income",
      confidence: 78,
      alternativeCategories: ["Business Income", "Consulting"],
    },
  ])

  const handleAcceptSuggestion = (id: string) => {
    setPendingTransactions((prev) => prev.filter((t) => t.id !== id))
    // In real app, would update the transaction with the suggested category
  }

  const handleRejectSuggestion = (id: string) => {
    setPendingTransactions((prev) => prev.filter((t) => t.id !== id))
    // In real app, would mark for manual categorization
  }

  const handleAcceptAll = () => {
    setPendingTransactions([])
    // In real app, would accept all high-confidence suggestions
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return "High Confidence"
    if (confidence >= 75) return "Medium Confidence"
    return "Low Confidence"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Categorization</h1>
          <p className="text-muted-foreground">Review and approve AI-suggested transaction categories</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleAcceptAll} disabled={pendingTransactions.length === 0}>
            <Sparkles className="w-4 h-4 mr-2" />
            Accept All High Confidence
          </Button>
          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Retrain AI
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-foreground">{pendingTransactions.length}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Confidence</p>
              <p className="text-2xl font-bold text-green-600">
                {pendingTransactions.filter((t) => t.confidence >= 90).length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Medium Confidence</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingTransactions.filter((t) => t.confidence >= 75 && t.confidence < 90).length}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
              <p className="text-2xl font-bold text-foreground">94%</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Pending Transactions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Transactions Awaiting Review</h2>

        {pendingTransactions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No transactions pending categorization. Great job!</p>
            </div>
          </Card>
        ) : (
          pendingTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div
                      className={`flex items-center font-medium ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* AI Suggestion */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-foreground">AI Suggestion</span>
                          <Badge className="bg-blue-100 text-blue-800">{transaction.suggestedCategory}</Badge>
                        </div>
                        <span className={`text-sm font-medium ${getConfidenceColor(transaction.confidence)}`}>
                          {getConfidenceLabel(transaction.confidence)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={transaction.confidence} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground">{transaction.confidence}%</span>
                      </div>
                    </div>

                    {/* Alternative Categories */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Alternative Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {transaction.alternativeCategories.map((category, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-6">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptSuggestion(transaction.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRejectSuggestion(transaction.id)}>
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* AI Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Most Accurate Categories</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Food & Dining</span>
                <span className="text-sm font-medium text-green-600">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transportation</span>
                <span className="text-sm font-medium text-green-600">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bills & Utilities</span>
                <span className="text-sm font-medium text-green-600">94%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Learning Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium text-foreground">+2.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last 30 Days</span>
                <span className="text-sm font-medium text-foreground">+5.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Trend</span>
                <span className="text-sm font-medium text-green-600">Improving</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
