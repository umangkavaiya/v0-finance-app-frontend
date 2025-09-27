"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, TrendingUp, Target, CreditCard, PieChart, Lightbulb } from "lucide-react"
import { apiClient } from "@/lib/api-client"

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

  const handleSendMessage = async (message?: string) => {
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

    try {
      const response = await apiClient.chatWithFinBot(messageToSend)

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: response.message,
        timestamp: new Date(),
        data: response.data,
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("FinBot error:", error)
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: "I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
        suggestions: ["Show spending summary", "How can I save more?", "Track my goals"],
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
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
