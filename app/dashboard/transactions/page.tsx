"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, Filter, Download, Edit, Check, X, IndianRupee } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: "debit" | "credit"
  status: "categorized" | "pending"
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-01-15",
      description: "Swiggy Order - Pizza Hut",
      amount: -850,
      category: "Food & Dining",
      type: "debit",
      status: "categorized",
    },
    {
      id: "2",
      date: "2024-01-14",
      description: "Salary Credit",
      amount: 120000,
      category: "Income",
      type: "credit",
      status: "categorized",
    },
    {
      id: "3",
      date: "2024-01-13",
      description: "Uber Ride",
      amount: -320,
      category: "Transportation",
      type: "debit",
      status: "categorized",
    },
    {
      id: "4",
      date: "2024-01-12",
      description: "Amazon Purchase",
      amount: -2500,
      category: "Shopping",
      type: "debit",
      status: "pending",
    },
    {
      id: "5",
      date: "2024-01-11",
      description: "Netflix Subscription",
      amount: -799,
      category: "Entertainment",
      type: "debit",
      status: "categorized",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState("")

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Income",
    "Other",
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      // Simulate CSV processing
      console.log("Processing CSV file:", file.name)
      // In a real app, you would parse the CSV and add transactions
    }
  }

  const handleEditCategory = (id: string, currentCategory: string) => {
    setEditingId(id)
    setEditCategory(currentCategory)
  }

  const handleSaveCategory = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, category: editCategory, status: "categorized" as const } : t)),
    )
    setEditingId(null)
    setEditCategory("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditCategory("")
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-green-100 text-green-800",
      Transportation: "bg-blue-100 text-blue-800",
      Shopping: "bg-yellow-100 text-yellow-800",
      Entertainment: "bg-purple-100 text-purple-800",
      "Bills & Utilities": "bg-red-100 text-red-800",
      Healthcare: "bg-pink-100 text-pink-800",
      Education: "bg-indigo-100 text-indigo-800",
      Income: "bg-emerald-100 text-emerald-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Management</h1>
          <p className="text-muted-foreground">Upload, view, and categorize your transactions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload Transaction Data</h3>
          <p className="text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
          <div className="relative inline-block">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button size="lg">Choose CSV File</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Supported format: CSV files from your bank</p>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="categorized">Categorized</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <Badge variant="secondary">{filteredTransactions.length} transactions</Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {editingId === transaction.id ? (
                        <div className="flex items-center space-x-2">
                          <Select value={editCategory} onValueChange={setEditCategory}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => handleSaveCategory(transaction.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge className={getCategoryColor(transaction.category)}>{transaction.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center font-medium ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "categorized" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingId !== transaction.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(transaction.id, transaction.category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold text-foreground mb-2">Total Transactions</h4>
          <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-foreground mb-2">Categorized</h4>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter((t) => t.status === "categorized").length}
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-foreground mb-2">Pending Review</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {transactions.filter((t) => t.status === "pending").length}
          </p>
        </Card>
      </div>
    </div>
  )
}
