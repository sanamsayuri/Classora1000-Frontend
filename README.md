<<<<<<< HEAD
# SchoolXP - SaaS Educational ERP System

SchoolXP is a comprehensive multi-tenant SaaS ERP system designed for educational institutions. It provides a robust and centralized platform to manage day-to-day school operations, including user administration, student enrollment, attendance tracking, fee management, examination grading, and communication.

## Platform Features

* **Multi-Tenancy:** Supports multiple schools within a single application instance, utilizing a subdomain-based architecture for seamless isolation and scalable performance.
* **Role-Based Access Control (RBAC):** Distinct access levels tailored for safe operations:
  * **Super Admin:** System-level configuration and global school management.
  * **School Admin:** Manage individual school particulars, staff, and overall operations.
  * **Teacher:** Complete oversight of sections, assignments, attendance, and exam marks.
  * **Parent:** Track student progress, attendance, and fee payment statuses.
  * **Student:** Access to assignments, marks, certificates, and personal notices.
* **Academics Management:** Intuitive setup for classes, sections, assignments, notices, and certificate generation.
* **Financial Management:** Automated fee structures, tracking of payments, integration with Razorpay, and robust financial reporting.
* **Examination System:** Comprehensive tracking for exams, defining grading constraints, and detailed marks tracking.

## Technology Stack

### Frontend
- **Framework:** Next.js (via App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

### Backend
- **Framework:** Node.js with Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT & bcrypt (with Supabase SDK integration)
- **Payments Integration:** Razorpay
- **Language:** TypeScript

## Architecture & Data Model

The backend leverages a strong, highly relational SQL data model configured via Prisma. Key models include:
- **Core Entity:** `School`
- **Users & Personas:** `User`, `Profile`, `Parent`, `Teacher`, `Student`
- **Academics:** `Class`, `Section`, `Attendance`, `Assignment`
- **Finance:** `FeeStructure`, `FeePayment`, `Payment` (with Razorpay integration points)
- **Evaluation & Communication:** `Exam`, `Mark`, `Certificate`, `Notice`

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (latest LTS recommended)
* [PostgreSQL](https://www.postgresql.org/) database
* Razorpay Test Account (for testing payments)

### Environment Setup

Create `.env` files in both the frontend and backend directories.

**Backend (`backend/.env`):**
```env
# Prisma database connection URLs
DATABASE_URL="postgresql://user:password@localhost:5432/schoolxp"
DIRECT_URL="postgresql://user:password@localhost:5432/schoolxp"

# Other integrations like Razorpay keys, JWT secrets, etc.
```

### Installation

1. **Navigate to the core project directory:**
   ```bash
   cd school_saas
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   # synchronize database schema
   npx prisma db push 
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application Local Dev Environment

**1. Start the Backend Server:**
```bash
cd backend
npx nodemon index.ts # if configured this way, or map to the appropriate typescript node command.
```

**2. Start the Frontend Next.js App:**
```bash
cd frontend
npm run dev
```

The Next.js application will be available at [http://localhost:3000](http://localhost:3000).
=======
# Classora1000-Frontend
>>>>>>> 58ee3559a184135f2cec845388170e13a1943a92
