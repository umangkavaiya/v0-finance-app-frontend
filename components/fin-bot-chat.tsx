"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, TrendingUp, Target, CreditCard, PieChart, Lightbulb } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  message: string
  timestamp: Date
  suggestions?: string[]
  data?: any
}

interface FinBotChatProps {
  collapsed: boolean
}

export default function FinBotChat({ collapsed }: FinBotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      message:
        "Hello! I'm Fin-Bot, your AI financial assistant. I can help you with budgeting, spending analysis, goal tracking, and financial advice. What would you like to know?",
      timestamp: new Date(),
      suggestions: ["Show my spending summary", "How can I save more?", "Track my goals", "Budget analysis"],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { icon: PieChart, label: "Spending Summary", query: "Show me my spending summary for this month" },
    { icon: Target, label: "Goal Progress", query: "How am I doing with my financial goals?" },
    { icon: TrendingUp, label: "Savings Tips", query: "Give me personalized savings tips" },
    { icon: CreditCard, label: "Budget Status", query: "What's my current budget status?" },
  ]

  const financialResponses = {
    "spending summary": {
      message: "Based on your recent transactions, here's your spending breakdown for this month:",
      data: {
        total: 95000,
        categories: [
          { name: "Food & Dining", amount: 35000, percentage: 37 },
          { name: "Shopping", amount: 25000, percentage: 26 },
          { name: "Transportation", amount: 15000, percentage: 16 },
          { name: "Bills & Utilities", amount: 18000, percentage: 19 },
          { name: "Entertainment", amount: 2000, percentage: 2 },
        ],
      },
      suggestions: ["How can I reduce dining expenses?", "Set a shopping budget", "View detailed transactions"],
    },
    "financial goals": {
      message: "Here's your current goal progress:",
      data: {
        goals: [
          { name: "Emergency Fund", progress: 50, target: 300000, current: 150000 },
          { name: "Vacation", progress: 31, target: 80000, current: 25000 },
          { name: "New Laptop", progress: 75, target: 60000, current: 45000 },
        ],
      },
      suggestions: ["Increase emergency fund contribution", "Set up auto-transfer", "Create new goal"],
    },
    "savings tips": {
      message: "Based on your spending patterns, here are personalized savings tips:",
      data: {
        tips: [
          "You've been spending 37% on dining. Try cooking at home 2-3 times a week to save ₹8,000/month.",
          "Consider switching to a monthly metro pass instead of daily tickets to save ₹2,500/month.",
          "Your entertainment spending is low - great job maintaining discipline!",
          "Set up automatic transfers of ₹10,000 to your emergency fund right after salary credit.",
        ],
      },
      suggestions: ["Create a meal plan", "Set spending alerts", "Automate savings"],
    },
    "budget status": {
      message: "Here's your current budget performance:",
      data: {
        totalBudget: 90000,
        totalSpent: 95000,
        status: "over",
        categories: [
          { name: "Food & Dining", budget: 40000, spent: 35000, status: "under" },
          { name: "Shopping", budget: 20000, spent: 25000, status: "over" },
          { name: "Transportation", budget: 12000, spent: 15000, status: "over" },
        ],
      },
      suggestions: ["Adjust shopping budget", "Review transportation costs", "Set spending alerts"],
    },
  }

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("spending") || lowerMessage.includes("summary")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        message: financialResponses["spending summary"].message,
        timestamp: new Date(),
        data: financialResponses["spending summary"].data,
        suggestions: financialResponses["spending summary"].suggestions,
      }
    }

    if (lowerMessage.includes("goal") || lowerMessage.includes("progress")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        message: financialResponses["financial goals"].message,
        timestamp: new Date(),
        data: financialResponses["financial goals"].data,
        suggestions: financialResponses["financial goals"].suggestions,
      }
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("tip")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        message: financialResponses["savings tips"].message,
        timestamp: new Date(),
        data: financialResponses["savings tips"].data,
        suggestions: financialResponses["savings tips"].suggestions,
      }
    }

    if (lowerMessage.includes("budget")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        message: financialResponses["budget status"].message,
        timestamp: new Date(),
        data: financialResponses["budget status"].data,
        suggestions: financialResponses["budget status"].suggestions,
      }
    }

    // Default responses for common queries
    const defaultResponses = [
      "I understand you're asking about your finances. Let me analyze your data and provide insights.",
      "That's a great question! Based on your spending patterns, I can help you make better financial decisions.",
      "I'm here to help you achieve your financial goals. Let me provide some personalized recommendations.",
    ]

    return {
      id: Date.now().toString(),
      type: "bot",
      message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      timestamp: new Date(),
      suggestions: ["Show spending breakdown", "Budget recommendations", "Goal tracking help"],
    }
  }

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageToSend)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (query: string) => {
    handleSendMessage(query)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  if (collapsed) {
    return (
      <div className="flex items-center justify-center h-full">
        <Bot className="w-6 h-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Fin-Bot</h3>
            <p className="text-xs text-muted-foreground">AI Financial Assistant</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-2 flex flex-col items-center space-y-1 bg-transparent"
              onClick={() => handleQuickAction(action.query)}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>

                  {/* Data visualization for bot messages */}
                  {message.type === "bot" && message.data && (
                    <div className="mt-3 space-y-2">
                      {message.data.categories && (
                        <div className="space-y-2">
                          {message.data.categories.map((category: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span>{category.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">₹{category.amount.toLocaleString()}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {category.percentage}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.data.goals && (
                        <div className="space-y-2">
                          {message.data.goals.map((goal: any, index: number) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{goal.name}</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <div className="w-full bg-background/20 rounded-full h-1">
                                <div
                                  className="bg-primary h-1 rounded-full"
                                  style={{ width: `${goal.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.data.tips && (
                        <div className="space-y-2">
                          {message.data.tips.map((tip: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2 text-xs">
                              <Lightbulb className="w-3 h-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs bg-transparent"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.type === "user" ? "order-1 ml-2 bg-primary" : "order-2 mr-2 bg-muted"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <Bot className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                <Bot className="w-4 h-4 text-muted-foreground" />
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about your finances..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={() => handleSendMessage()} size="sm" disabled={!inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Fin-Bot can help with budgeting, spending analysis, and financial advice.
        </p>
      </div>
    </div>
  )
}
