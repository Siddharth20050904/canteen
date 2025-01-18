# Canteen Management System

A Next.js-based canteen management system with features for attendance tracking, feedback collection, and menu management.

## Author

**Siddharth Suryavanshi**
- GitHub: [Siddharth20050904](https://github.com/Siddharth20050904)
- LinkedIn: [Siddharth Suryavanshi](www.linkedin.com/in/siddharth-suryavanshi-087786288)

## Features

- User Authentication & Authorization
- Attendance Management
- Feedback System
- Menu Management
- Weekly Menu Planning
- Feedback Analysis
- Attendance Statistics
- Suggestion System
- Admin Dashboard

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- NextAuth.js
- TailwindCSS
- PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## Project Setup

### 1. Clone the Repository
Clone this repository to your local machine using:
`git clone https://github.com/Siddharth20050904/canteen.git`

### 2. Install Dependencies
Navigate to the project directory and install required packages:
`npm install`

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

### 4. Database Setup
Create a PostgreSQL database and update the `DATABASE_URL` in your `.env` file.

### 5. Database Migration
Run database migrations:
`npx prisma migrate dev`

### 6. Start the Development Server
Start the development server:
`npm run dev`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/canteen_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (for OTP)
MAIL_PASS="your-email-app-password"
