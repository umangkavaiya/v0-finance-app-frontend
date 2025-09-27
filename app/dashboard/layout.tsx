"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import FinBotChat from "@/components/fin-bot-chat"
import {
  LayoutDashboard,
  CreditCard,
  Brain,
  TrendingUp,
  Target,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CreditCard, label: "Transaction Management", href: "/dashboard/transactions" },
    { icon: Brain, label: "AI-Powered Categorization", href: "/dashboard/categorization" },
    { icon: TrendingUp, label: "Financial Insights", href: "/dashboard/insights" },
    { icon: Target, label: "Goal Tracker", href: "/dashboard/goals" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  const getCurrentTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar */}
        <div
          className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && <h1 className="text-xl font-bold text-sidebar-foreground">FinBuddy</h1>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-background border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{getCurrentTime()}, Umang 👋</h2>
                <p className="text-muted-foreground">Welcome back to your financial dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="text-foreground">
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>

        {/* Right Sidebar - Enhanced Fin-Bot */}
        <div
          className={`${chatCollapsed ? "w-12" : "w-80"} bg-card border-l border-border transition-all duration-300 flex flex-col`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!chatCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Fin-Bot</h3>
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatCollapsed(!chatCollapsed)}
                className="text-card-foreground"
              >
                {chatCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Chat Component */}
          <div className="flex-1 overflow-hidden">
            <FinBotChat collapsed={chatCollapsed} />
          </div>
        </div>
      </div>
    </div>
  )
}
