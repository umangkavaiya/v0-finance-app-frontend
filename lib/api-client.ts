class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || ""
    this.baseUrl = envUrl.endsWith("/api") ? envUrl.slice(0, -4) : envUrl || "http://localhost:3000"

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const apiEndpoint = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`
    const url = `${this.baseUrl}${apiEndpoint}`
    console.log("[v0] Making API request to:", url)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Network error" }))
        console.log("[v0] API error response:", error)
        throw new Error(error.error || "Request failed")
      }

      const data = await response.json()
      console.log("[v0] API success response:", data)
      return data
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  // Auth methods
  async register(data: { fullName: string; email: string; age: number; password: string }) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Transaction methods
  async getTransactions(params?: { category?: string; type?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.type) searchParams.set("type", params.type)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/transactions${query ? `?${query}` : ""}`)
  }

  async createTransaction(data: {
    date: string
    description: string
    amount: number
    type: "debit" | "credit"
    category?: string
  }) {
    return this.request("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(
    id: string,
    data: Partial<{
      date: string
      description: string
      amount: number
      category: string
      type: "debit" | "credit"
    }>,
  ) {
    return this.request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: "DELETE",
    })
  }

  async uploadTransactions(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}/api/transactions/upload`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(error.error || "Upload failed")
    }

    return response.json()
  }

  // Goal methods
  async getGoals() {
    return this.request("/goals")
  }

  async createGoal(data: {
    name: string
    description: string
    targetAmount: number
    currentAmount?: number
    deadline: string
    category: string
    priority: "high" | "medium" | "low"
    monthlyContribution: number
  }) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateGoal(
    id: string,
    data: Partial<{
      name: string
      description: string
      targetAmount: number
      currentAmount: number
      deadline: string
      category: string
      priority: "high" | "medium" | "low"
      status: "active" | "completed" | "paused"
      monthlyContribution: number
    }>,
  ) {
    return this.request(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: "DELETE",
    })
  }

  // Settings methods
  async getSettings() {
    return this.request("/settings")
  }

  async updateSettings(data: {
    fullName?: string
    age?: number
    currency?: string
    timezone?: string
  }) {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // AI methods
  async getInsights() {
    return this.request("/insights")
  }

  async chatWithFinBot(message: string) {
    return this.request("/ai/finbot", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }
}

export const apiClient = new ApiClient()
