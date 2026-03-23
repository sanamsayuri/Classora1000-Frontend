# Database

This directory serves as the reference point for all database-related documentation and migrations.

## Schema Location

The primary Prisma schema is located at:
```
backend/prisma/schema.prisma
```

## Database Provider

- **PostgreSQL** hosted on Supabase
- **ORM**: Prisma

## Multi-Tenancy

All tables include a `school_id` field to ensure data isolation between schools.

## Running Migrations

```bash
cd backend
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

## Models

| Model | Description |
|-------|-------------|
| School | School/tenant records |
| User | Authentication & roles |
| Profile | User profile details |
| Parent | Parent records |
| Teacher | Teacher records |
| Student | Student records |
| Class | Class definitions |
| Section | Sections within classes |
| Attendance | Daily attendance |
| FeeStructure | Fee templates |
| FeePayment | Fee payment records |
| Payment | Razorpay payment tracking |
| Exam | Exam definitions |
| Mark | Student marks |
| Certificate | Student certificates |
| Notice | School notices |
| Assignment | Teacher assignments |
