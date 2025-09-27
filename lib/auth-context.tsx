"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api-client"

interface User {
  id: string
  fullName: string
  email: string
  age?: number
  currency: string
  timezone: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { fullName: string; email: string; age: number; password: string }) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      apiClient.setToken(savedToken)
      // Optionally verify token and get user data
      fetchUserData()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await apiClient.getSettings()
      setUser(response.user)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.user)
      setToken(response.token)
      apiClient.setToken(response.token)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: { fullName: string; email: string; age: number; password: string }) => {
    try {
      const response = await apiClient.register(data)
      setUser(response.user)
      setToken(response.token)
      apiClient.setToken(response.token)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    apiClient.clearToken()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
