"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Target,
  Plus,
  Calendar,
  IndianRupee,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface Goal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: "high" | "medium" | "low"
  status: "active" | "completed" | "paused"
  monthlyContribution: number
  createdAt: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      description: "Build a 6-month emergency fund for financial security",
      targetAmount: 300000,
      currentAmount: 150000,
      deadline: "2024-12-31",
      category: "Emergency",
      priority: "high",
      status: "active",
      monthlyContribution: 15000,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Dream Vacation",
      description: "Save for a 2-week trip to Europe",
      targetAmount: 80000,
      currentAmount: 25000,
      deadline: "2024-08-15",
      category: "Travel",
      priority: "medium",
      status: "active",
      monthlyContribution: 8000,
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "New Laptop",
      description: "MacBook Pro for work and personal projects",
      targetAmount: 60000,
      currentAmount: 45000,
      deadline: "2024-03-31",
      category: "Technology",
      priority: "high",
      status: "active",
      monthlyContribution: 5000,
      createdAt: "2024-01-10",
    },
    {
      id: "4",
      name: "Home Down Payment",
      description: "Save for down payment on first home",
      targetAmount: 500000,
      currentAmount: 125000,
      deadline: "2025-06-30",
      category: "Real Estate",
      priority: "high",
      status: "active",
      monthlyContribution: 20000,
      createdAt: "2023-12-01",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
    priority: "medium" as const,
    monthlyContribution: "",
  })

  const categories = ["Emergency", "Travel", "Technology", "Real Estate", "Education", "Health", "Investment", "Other"]

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "paused":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const calculateMonthsToGoal = (current: number, target: number, monthlyContribution: number) => {
    if (monthlyContribution <= 0) return "∞"
    const remaining = target - current
    if (remaining <= 0) return "0"
    return Math.ceil(remaining / monthlyContribution)
  }

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      description: newGoal.description,
      targetAmount: Number.parseInt(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category || "Other",
      priority: newGoal.priority,
      status: "active",
      monthlyContribution: Number.parseInt(newGoal.monthlyContribution) || 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setGoals([...goals, goal])
    setNewGoal({
      name: "",
      description: "",
      targetAmount: "",
      deadline: "",
      category: "",
      priority: "medium",
      monthlyContribution: "",
    })
    setIsCreateDialogOpen(false)
  }

  const totalGoalsValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const activeGoals = goals.filter((goal) => goal.status === "active").length
  const completedGoals = goals.filter((goal) => goal.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goal Tracker</h1>
          <p className="text-muted-foreground">Set, track, and achieve your financial goals</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Brief description of your goal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="100000"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={newGoal.monthlyContribution}
                    onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
              <p className="text-2xl font-bold text-foreground">{activeGoals}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Target</p>
              <p className="text-2xl font-bold text-foreground flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {(totalGoalsValue / 100000).toFixed(1)}L
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
              <p className="text-2xl font-bold text-green-600 flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {(totalSaved / 100000).toFixed(1)}L
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-foreground">{((totalSaved / totalGoalsValue) * 100).toFixed(0)}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusIcon(goal.status)}
                    <span className="ml-1 capitalize">{goal.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <Badge className={getPriorityColor(goal.priority)} variant="outline">
                    {goal.priority} priority
                  </Badge>
                  <span>{goal.category}</span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <Progress value={getProgressPercentage(goal.currentAmount, goal.targetAmount)} className="h-2" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-foreground">
                    {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}% Complete
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Contribution</p>
                  <p className="font-medium text-foreground flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {goal.monthlyContribution.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Months to Goal</p>
                  <p className="font-medium text-foreground">
                    {calculateMonthsToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution)} months
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Add Contribution</Button>
          <Button variant="outline">Set Auto-Transfer</Button>
          <Button variant="outline">View Goal History</Button>
          <Button variant="outline">Export Goals</Button>
        </div>
      </Card>
    </div>
  )
}
