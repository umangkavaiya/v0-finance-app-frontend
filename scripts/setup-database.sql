-- Initialize the FinBuddy database with Prisma schema
-- This script will be executed to set up the database tables

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER,
    "password" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- Create goals table
CREATE TABLE IF NOT EXISTS "goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "monthlyContribution" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Add foreign key constraints
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert sample data for testing
INSERT INTO "users" ("id", "fullName", "email", "password", "age") VALUES 
('user-1', 'John Doe', 'john@example.com', '$2b$10$example.hash.here', 28)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "transactions" ("id", "date", "description", "amount", "category", "type", "userId") VALUES 
('trans-1', '2024-01-15T10:30:00Z', 'Grocery Shopping', -85.50, 'Food & Dining', 'debit', 'user-1'),
('trans-2', '2024-01-14T14:20:00Z', 'Salary Credit', 5000.00, 'Income', 'credit', 'user-1'),
('trans-3', '2024-01-13T09:15:00Z', 'Coffee Shop', -12.75, 'Food & Dining', 'debit', 'user-1')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "goals" ("id", "name", "description", "targetAmount", "currentAmount", "deadline", "category", "priority", "monthlyContribution", "userId") VALUES 
('goal-1', 'Emergency Fund', 'Build emergency fund for 6 months expenses', 30000.00, 12500.00, '2024-12-31T23:59:59Z', 'Emergency', 'high', 2500.00, 'user-1'),
('goal-2', 'Vacation Fund', 'Save for Europe trip', 150000.00, 45000.00, '2024-08-15T23:59:59Z', 'Travel', 'medium', 15000.00, 'user-1')
ON CONFLICT ("id") DO NOTHING;
