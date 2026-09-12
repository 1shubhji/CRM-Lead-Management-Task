# ApexCRM - Lead Management Module

A premium, responsive CRM Lead Management module developed for tracking customer pipelines. Built using **Next.js (App Router)** with **Tailwind CSS v4** on the frontend, and **NestJS** with **Prisma ORM** connecting to **PostgreSQL** on the backend.

---

## Features Built

### 1. Backend REST APIs (NestJS)
- **POST /api/leads**: Registers a new lead.
  - Implements field-level constraints: Phone number must be exactly 10 digits; Email format must be valid.
  - Ensures data integrity: Disallows duplicate email and phone entries (returns `409 Conflict`).
- **GET /api/leads**: Lists leads with support for:
  - **Case-Insensitive Search**: Matches queries against Name, Company, Phone, and Email.
  - **Filters**: Filter results by Status (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`), Priority (`High`, `Medium`, `Low`), and Assigned Employee.
  - **Sorting**: Toggle sorting by created date (Newest First vs. Oldest First).
  - **Server-Side Pagination**: Implements standard offset pagination (defaulting to 10 records per page).
- **GET /api/leads/:id**: Fetches detailed info of a single lead by UUID.
- **PATCH /api/leads/:id**: Modifies details of an existing lead (re-validates unique constraints).
- **DELETE /api/leads/:id**: Deletes a lead.

### 2. Frontend Interface (Next.js)
- **KPI Metrics**: Dynamic dashboard indicators showing Total Leads, High Priority Cases, and Won Closed Conversions.
- **Dynamic Filter Bar**: Text search and status/priority dropdowns, integrated with debouncing (450ms) to throttle network requests.
- **Sortable Data Table**: Compact layout displaying lead attributes with click-to-sort created date column and actions overlays.
- **Lead form Modal**: Multi-mode form overlay supporting validation rules with instant client-side feedback.
- **Toast Alerts**: Micro-animated notification toasts communicating operations outcomes.

---

## Directory Structure

```
Project Assignment/
├── backend/                  # NestJS REST API Project
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma DB Schema modeling
│   │   └── schema.sql        # Raw PostgreSQL SQL Migration Schema
│   ├── src/
│   │   ├── prisma/           # Global PrismaService Module
│   │   ├── leads/            # Leads REST Controller, DTOs & Service
│   │   └── main.ts           # CORS, global validation pipes & port configuration
│   └── .env                  # Backend environment settings
├── frontend/                 # Next.js App Router Client Project
│   ├── src/
│   │   ├── types/            # Shared TypeScript interfaces
│   │   ├── services/         # API Service client mapping backend
│   │   ├── components/       # Dashboard UI widgets (Table, Modal, Filters)
│   │   └── app/
│   │       ├── globals.css   # Tailwind CSS setup
│   │       ├── layout.tsx    # Root layout configuration (using offline system fonts)
│   │       └── page.tsx      # Main Dashboard Assembly
│   └── package.json
└── Leads_API.postman_collection.json # API Request Documentation
```

---

## Setup & Running Instructions

### Prerequisites
- **Node.js** (v20+ recommended, built on v25.0.0)
- **npm** (v10+ recommended, built on v11.1.0)
- **PostgreSQL** (v17 or v18, listening locally on port `5433` or `5432`)

---

### Step 1: Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure database credentials in `backend/.env`. Update the `DATABASE_URL` password value with your local PostgreSQL password:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/crm_lead_management?schema=public"
   PORT=3001
   ```
3. Run the database migration to create the tables in your local PostgreSQL:
   ```bash
   npx prisma db push
   ```
4. Start the backend developer API server:
   ```bash
   npm run start:dev
   ```
   *The API will start running on [http://localhost:3001/api](http://localhost:3001/api)*

---

### Step 2: Frontend Setup
1. Open a new terminal tab, and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend client will start running on [http://localhost:3000](http://localhost:3000)*

3. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## Testing the APIs (Postman Collection)

We have provided a Postman collection containing requests for all CRUD routes, including search, filter, sorting, and validation checks.
- Import the [Leads_API.postman_collection.json](./Leads_API.postman_collection.json) file at the root of the workspace into Postman to execute endpoint tests.
