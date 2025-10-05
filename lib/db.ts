import { MongoClient, type Db, type Collection, ObjectId } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined
  // eslint-disable-next-line no-var
  var __mongoDb: Db | undefined
  // eslint-disable-next-line no-var
  var __mongoInit: Promise<void> | undefined
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "finbuddy"

if (!uri) {
  console.warn("[v0] MONGODB_URI is not set. Please add it in Environment Variables.")
}

async function connectMongo(): Promise<{ client: MongoClient; db: Db }> {
  if (!globalThis.__mongoClient) {
    const client = new MongoClient(uri || "")
    globalThis.__mongoClient = client
  }
  if (!globalThis.__mongoClient.topology?.isConnected()) {
    await globalThis.__mongoClient.connect()
  }

  if (!globalThis.__mongoDb) {
    globalThis.__mongoDb = globalThis.__mongoClient.db(dbName)
  }

  // Ensure indexes exactly once
  if (!globalThis.__mongoInit) {
    globalThis.__mongoInit = (async () => {
      const db = globalThis.__mongoDb!
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true }),
        db.collection("transactions").createIndex({ userId: 1, date: -1 }),
        db.collection("goals").createIndex({ userId: 1, deadline: 1 }),
      ])
      console.log("[v0] MongoDB indexes ensured")
    })().catch((e) => {
      console.error("[v0] MongoDB index creation error:", e)
      // Do not block app if index creation fails
    })
  }

  return { client: globalThis.__mongoClient, db: globalThis.__mongoDb }
}

export async function getDb(): Promise<Db> {
  const { db } = await connectMongo()
  return db
}

export function users(db: Db): Collection<UserDoc> {
  return db.collection<UserDoc>("users")
}
export function transactions(db: Db): Collection<TransactionDoc> {
  return db.collection<TransactionDoc>("transactions")
}
export function goals(db: Db): Collection<GoalDoc> {
  return db.collection<GoalDoc>("goals")
}

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id)
}

export type UserDoc = {
  _id?: ObjectId
  id?: string
  fullName: string
  email: string
  age?: number
  password: string
  currency: string
  timezone: string
  createdAt: Date
}

export type TransactionDoc = {
  _id?: ObjectId
  id?: string
  userId: string
  date: Date
  description: string
  amount: number
  category: string
  type: "debit" | "credit"
  status: "pending" | "categorized"
  createdAt: Date
}

export type GoalDoc = {
  _id?: ObjectId
  id?: string
  userId: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  priority: "high" | "medium" | "low"
  status: "active" | "completed" | "paused"
  monthlyContribution: number
  createdAt: Date
}

export function withId<T extends { _id?: ObjectId }>(doc: T | null) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id?.toString(), ...rest } as any
}

export function manyWithId<T extends { _id?: ObjectId }>(arr: T[]) {
  return arr.map((d) => withId(d))
}
