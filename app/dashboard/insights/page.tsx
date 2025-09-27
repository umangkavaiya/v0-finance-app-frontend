"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  IndianRupee,
  Sparkles,
  RefreshCw,
} from "lucide-react"

export default function InsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  // Sample data for charts
  const spendingTrends = [
    { month: "Jul", spending: 85000, budget: 90000, savings: 35000 },
    { month: "Aug", spending: 92000, budget: 90000, savings: 28000 },
    { month: "Sep", spending: 78000, budget: 90000, savings: 42000 },
    { month: "Oct", spending: 105000, budget: 90000, savings: 15000 },
    { month: "Nov", spending: 88000, budget: 90000, savings: 32000 },
    { month: "Dec", spending: 95000, budget: 90000, savings: 25000 },
  ]

  const categoryInsights = [
    { category: "Food & Dining", current: 35000, previous: 42000, change: -16.7, trend: "down" },
    { category: "Transportation", current: 15000, previous: 12500, change: 20, trend: "up" },
    { category: "Shopping", current: 25000, previous: 18000, change: 38.9, trend: "up" },
    { category: "Entertainment", current: 12000, previous: 15000, change: -20, trend: "down" },
    { category: "Bills & Utilities", current: 18000, previous: 17500, change: 2.9, trend: "up" },
  ]

  const aiInsights = [
    {
      type: "positive",
      title: "Great Progress on Dining Budget",
      description: "You've reduced dining expenses by 16.7% this month. Keep up the good work!",
      impact: "Saved ₹7,000",
      confidence: 95,
    },
    {
      type: "warning",
      title: "Shopping Spending Alert",
      description:
        "Your shopping expenses increased by 38.9% compared to last month. Consider reviewing recent purchases.",
      impact: "Over budget by ₹7,000",
      confidence: 88,
    },
    {
      type: "suggestion",
      title: "Transportation Optimization",
      description: "Based on your travel patterns, switching to a monthly metro pass could save you ₹2,500/month.",
      impact: "Potential savings: ₹2,500",
      confidence: 82,
    },
    {
      type: "goal",
      title: "Emergency Fund Progress",
      description: "You're 50% towards your emergency fund goal. Consider increasing monthly contributions by ₹5,000.",
      impact: "Goal completion: 8 months faster",
      confidence: 90,
    },
  ]

  const budgetPerformance = [
    { category: "Food & Dining", budget: 40000, spent: 35000, remaining: 5000 },
    { category: "Transportation", budget: 12000, spent: 15000, remaining: -3000 },
    { category: "Shopping", budget: 20000, spent: 25000, remaining: -5000 },
    { category: "Entertainment", budget: 15000, spent: 12000, remaining: 3000 },
    { category: "Bills & Utilities", budget: 18000, spent: 18000, remaining: 0 },
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "suggestion":
        return <Lightbulb className="w-5 h-5 text-blue-500" />
      case "goal":
        return <Target className="w-5 h-5 text-purple-500" />
      default:
        return <Sparkles className="w-5 h-5 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "suggestion":
        return "border-blue-200 bg-blue-50"
      case "goal":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Insights</h1>
          <p className="text-muted-foreground">AI-powered analysis of your spending patterns and recommendations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 Months
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Insights
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Savings Rate</p>
              <p className="text-2xl font-bold text-green-600">21%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">+2.3% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget Adherence</p>
              <p className="text-2xl font-bold text-yellow-600">78%</p>
            </div>
            <Target className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">3 categories over budget</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Spending Efficiency</p>
              <p className="text-2xl font-bold text-blue-600">85%</p>
            </div>
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Above average</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Financial Health Score</p>
              <p className="text-2xl font-bold text-purple-600">B+</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Improving trend</p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className={`p-6 ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {insight.impact}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Spending vs Budget Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
                  <Line type="monotone" dataKey="spending" stroke="#ef4444" strokeWidth={2} name="Spending" />
                  <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Budget" />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Savings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Category Performance</h3>
            <div className="space-y-4">
              {categoryInsights.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium text-foreground">{category.category}</h4>
                      <p className="text-sm text-muted-foreground">₹{category.current.toLocaleString()} this month</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {category.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`font-medium ${category.change > 0 ? "text-red-600" : "text-green-600"}`}>
                      {category.change > 0 ? "+" : ""}
                      {category.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Budget Performance</h3>
            <div className="space-y-6">
              {budgetPerformance.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-medium">
                          {item.spent.toLocaleString()} / {item.budget.toLocaleString()}
                        </span>
                      </div>
                      <span className={`text-sm ${item.remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.remaining >= 0 ? "Under" : "Over"} by ₹{Math.abs(item.remaining).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={Math.min((item.spent / item.budget) * 100, 100)}
                    className={`h-2 ${item.remaining < 0 ? "bg-red-100" : ""}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Spending Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Next Month Forecast</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Predicted Spending</span>
                    <span className="font-medium text-foreground">₹92,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence Level</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Variance Range</span>
                    <span className="font-medium text-muted-foreground">±₹8,000</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Seasonal Trends</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Holiday Season Impact</span>
                    <span className="font-medium text-yellow-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Festival Spending</span>
                    <span className="font-medium text-red-600">+25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Summer Vacation</span>
                    <span className="font-medium text-blue-600">+20%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
