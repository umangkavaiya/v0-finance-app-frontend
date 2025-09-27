"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lightbulb, TrendingUp, Shield, User, Mail, Lock, Calendar } from "lucide-react"

export default function LandingPage() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          age: Number.parseInt(formData.age),
          password: formData.password,
        })
      } else {
        await login(formData.email, formData.password)
      }
      router.push("/dashboard")
    } catch (error) {
      console.error("Authentication error:", error)
      // Handle error (show toast, etc.)
    }
  }

  const features = [
    {
      icon: <Lightbulb className="w-8 h-8 text-white" />,
      title: "AI-Powered Insights",
      description: "Get personalized financial recommendations based on your spending patterns and goals.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Smart Budgeting",
      description: "Automatically categorize expenses and create budgets that adapt to your lifestyle.",
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security.",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-landing-neutral">
      {/* Sophisticated geometric background */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-landing-primary/20 via-landing-secondary/15 to-landing-accent/25"></div>

        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large geometric elements */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-landing-primary/10 to-landing-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-landing-accent/15 to-landing-secondary/8 rounded-full blur-2xl"></div>

          {/* Medium geometric elements */}
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-landing-primary/8 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-landing-accent/12 rounded-full blur-lg"></div>

          {/* Small accent elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-landing-secondary/10 rounded-full blur-md"></div>
          <div className="absolute top-16 right-1/3 w-24 h-24 bg-landing-accent/8 rounded-full blur-sm"></div>
          <div className="absolute bottom-16 left-1/3 w-20 h-20 bg-landing-primary/6 rounded-full blur-sm"></div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-32 left-1/4 w-4 h-4 bg-landing-primary/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-landing-accent/25 rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-landing-secondary/15 rotate-45 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Features */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">AI-Powered Finance</h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Transform your financial life with intelligent insights, automated budgeting, and personalized
              recommendations.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border-border/50 p-6 hover:bg-card/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                      <div className="w-8 h-8 text-primary">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Authentication Form */}
        <div className="flex-shrink-0 w-full max-w-md flex items-center justify-center p-8">
          <Card className="w-full bg-card/95 backdrop-blur-md border-border/50 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? "Join thousands managing their finances better" : "Sign in to your FinBuddy account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      name="age"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {isSignUp ? "Sign In" : "Sign up"}
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
