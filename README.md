# RateSphere 🏪✨

Welcome to **RateSphere**, a premium, modern, and responsive Store Rating & Review SaaS platform. Built with a gorgeous frosted glassmorphism white theme and high-refraction aesthetics, it connects a robust Node.js/Express backend with a highly-interactive React frontend powered by Vite and Prisma ORM.

---

## 🚀 Key Features

*   **👑 Admin Console**:
    *   Dynamic metrics dashboard with count-up animations.
    *   Manage platform users (create System Admins, Normal Users, Store Owners).
    *   Register and assign stores to owners.
    *   View user list and store registry.
*   **👤 Normal User Dashboard**:
    *   Search stores by Name and Address inline.
    *   Sort catalog columns dynamically (Name, Address, Overall Rating).
    *   Interactive 1–5 star rating module with spring animations.
    *   Display overall ratings and update submitted ratings dynamically.
*   **🏪 Store Owner Dashboard**:
    *   Metrics dashboard displaying overall average store rating and total reviews.
    *   Sortable customer review list (User Name, Email, Address, and Rating).
*   **🎨 Premium Glassmorphism UI**:
    *   Frosted glass panels (`backdrop-filter: blur(20px)`).
    *   Refracted water-droplet borders and champagne-tinted color palette.
    *   Floating glass navbar and custom glassmorphic scrollbars.
    *   Shimmering skeleton loading states for cards and tables.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), React Router, Lucide React Icons
*   **Backend**: Node.js, Express, JSON Web Tokens (JWT)
*   **Database**: PostgreSQL
*   **ORM**: Prisma ORM (v7.8.0)
*   **Styling**: Vanilla CSS (Frosted Glassmorphism, CSS Transitions & Keyframes)

---

## 📂 Project Structure

```text
Store Rating/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (CountUp, Skeleton loaders, etc.)
│   │   ├── context/        # Auth Context & JWT session management
│   │   ├── layouts/        # Shared Layouts (Floating Nav bar)
│   │   ├── pages/          # Dashboard Pages (Admin, User, Owner, Login, Signup)
│   │   ├── services/       # Axios client & Backend APIs connection
│   │   └── index.css       # Light-Theme design tokens & animations
├── server/                 # Express Backend API
│   ├── config/             # Database connection & Prisma client
│   ├── controllers/        # Request handlers (Auth, Admin, User, Owner)
│   ├── middleware/         # JWT authentication & Role guards
│   ├── prisma/             # Schema definition & Seeding scripts
│   ├── routes/             # API routes definitions
│   └── services/           # Database queries & Business logic
```

---

## ⚙️ Local Development Setup

### Prerequisites
*   Node.js (v18 or higher)
*   PostgreSQL database instance

### 1. Database Setup
Create a `.env` file inside the `server/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/storerating?sslmode=disable"
PORT=5000
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### 2. Backend Installation & Migration
```bash
cd server
npm install

# Push the schema to your database
npx prisma db push

# Seed the database
node prisma/seed.js
```

### 3. Frontend Installation
```bash
cd ../client
npm install
```

### 4. Run Locally
Start the backend server:
```bash
# In server directory
npm run dev
```

Start the frontend Vite app:
```bash
# In client directory
npm run dev
```
Open **`http://localhost:5173/`** to explore the application!

---

## 🔑 Seeded Demo Credentials

Use these seeded accounts to log in and test different dashboard views:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@example.com` | `Admin@123` | System Administrator |
| **👑 ADMIN 2** | `admin2@example.com` | `Admin2@123` | Secondary Admin |
| **🏪 OWNER** | `owner@example.com` | `Owner@123` | Store Owner (Tech World) |
| **🏪 OWNER 1-10** | `owner1@example.com` | `Owner@123` | Programmable owners (Stores 1-10) |
| **👤 USER** | `user@example.com` | `User@123` | Tanvi Sandbhor Demo User |

---

## ☁️ Deployment Notes

### Render PostgreSQL SSL Mode
When deploying to Render, the database requires SSL connections from external clients. Ensure you append **`?sslmode=require`** to your production `DATABASE_URL` environment variable:
```text
postgresql://dbadmin:YOUR_PASSWORD@dpg-xxx-a.oregon-postgres.render.com/storerating_mjxn?sslmode=require
```

### Build Command on Render
Set the following build command in your Render Dashboard:
```bash
npm install && npx prisma generate
```
*(If deploying as a monorepo, use: `cd server && npm install && npx prisma generate`)*

---

Made with ❤️ for beautiful, interactive SaaS dashboards.
