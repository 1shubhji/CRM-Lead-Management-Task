-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "lead_name" TEXT NOT NULL,
    "company_name" TEXT,
    "phone_number" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "city" TEXT,
    "lead_source" TEXT,
    "assigned_employee" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "priority" "Priority" NOT NULL DEFAULT 'Medium',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_phone_number_key" ON "leads"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_address_key" ON "leads"("email_address");

-- CreateIndex
CREATE INDEX "leads_lead_name_idx" ON "leads"("lead_name");

-- CreateIndex
CREATE INDEX "leads_email_address_idx" ON "leads"("email_address");

-- CreateIndex
CREATE INDEX "leads_phone_number_idx" ON "leads"("phone_number");
