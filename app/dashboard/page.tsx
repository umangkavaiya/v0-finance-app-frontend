"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { TrendingUp, Target, Lightbulb, Upload, IndianRupee } from "lucide-react"

export default function DashboardPage() {
  // Sample data for charts
  const spendingData = [
    { name: "Food & Dining", value: 35000, color: "#10b981" },
    { name: "Transportation", value: 15000, color: "#3b82f6" },
    { name: "Shopping", value: 25000, color: "#f59e0b" },
    { name: "Entertainment", value: 12000, color: "#ef4444" },
    { name: "Bills & Utilities", value: 18000, color: "#8b5cf6" },
  ]

  const monthlyTrends = [
    { month: "Jan", spending: 85000, income: 120000 },
    { month: "Feb", spending: 92000, income: 120000 },
    { month: "Mar", spending: 78000, income: 120000 },
    { month: "Apr", spending: 105000, income: 120000 },
    { month: "May", spending: 88000, income: 120000 },
    { month: "Jun", spending: 95000, income: 120000 },
  ]

  const goals = [
    { name: "Emergency Fund", current: 150000, target: 300000, progress: 50 },
    { name: "Vacation", current: 25000, target: 80000, progress: 31 },
    { name: "New Laptop", current: 45000, target: 60000, progress: 75 },
  ]

  const insights = [
    "You've spent 15% less on dining out this month compared to last month. Great job!",
    "Consider setting up an automatic transfer to your emergency fund to reach your goal faster.",
    "Your transportation costs have increased by 20%. Review your commute options for potential savings.",
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-foreground flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                2,45,000
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month Spending</p>
              <p className="text-2xl font-bold text-foreground flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                95,000
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold text-foreground">21%</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Goals Progress</p>
              <p className="text-2xl font-bold text-foreground">52%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Spending Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {spendingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="spending" fill="#ef4444" name="Spending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Goals and Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Tracker */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Goal Tracker</h3>
            <Button size="sm" variant="outline">
              Add Goal
            </Button>
          </div>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Smart Insights */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-foreground">Smart Insights</h3>
          </div>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate New Insights
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Transactions</span>
          </Button>
          <Button variant="outline">Set New Goal</Button>
          <Button variant="outline">View Reports</Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </Card>
    </div>
  )
}
