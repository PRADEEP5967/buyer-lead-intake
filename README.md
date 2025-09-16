
---

# 📋 Buyer Lead Intake App

A small lead management app built using Next.js, TypeScript, and Postgres to capture, list, and manage buyer leads. It supports filtering, searching, CSV import/export, validation, history tracking, and more — with a focus on usability, correctness, and data safety.

---

## 🚀 Features

### ✅ Must-Haves Implemented

* **Create Lead** with validation, conditional fields, and history tracking
* **List & Search** with SSR pagination, filters, sort, and debounced search
* **View & Edit** with concurrency checks and edit history
* **Import/Export** via CSV with per-row validation and transactional inserts
* **Ownership & Auth**: Users can only edit/delete their own leads; others are read-only
* **Validation**: Client + server-side using Zod schemas
* **Rate limiting** to prevent abuse
* **Accessibility** improvements: labels, keyboard focus, and form error announcements
* **Unit test** for CSV row validator
* **Error boundaries** and empty states handled

### ✅ Nice-to-haves Included

* Tag chips with typeahead suggestions
* Status quick-actions via dropdown in the list view
* Basic full-text search on fullName, email, and notes fields

---

## 📦 Tech Stack

* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
* **Backend:** Postgres via Prisma ORM with migrations
* **Validation:** Zod schemas on client & server
* **Authentication:** Demo login using magic link
* **Git:** Meaningful commits with history
* **Testing:** Unit test for CSV validator
* **Deployment:** Optionally deployable via Vercel

---

## 🧱 Data Model

### **buyers (aka leads)**

| Field        | Type      | Notes                                                                         |
| ------------ | --------- | ----------------------------------------------------------------------------- |
| id           | uuid      | Primary key                                                                   |
| fullName     | string    | 2–80 chars                                                                    |
| email        | email     | Optional                                                                      |
| phone        | string    | 10–15 digits; required                                                        |
| city         | enum      | Chandigarh, Mohali, Zirakpur, Panchkula, Other                                |
| propertyType | enum      | Apartment, Villa, Plot, Office, Retail                                        |
| bhk          | enum      | 1, 2, 3, 4, Studio; required if propertyType is Apartment or Villa            |
| purpose      | enum      | Buy, Rent                                                                     |
| budgetMin    | int       | INR, optional                                                                 |
| budgetMax    | int       | INR, optional, must be ≥ budgetMin                                            |
| timeline     | enum      | 0-3m, 3-6m, >6m, Exploring                                                    |
| source       | enum      | Website, Referral, Walk-in, Call, Other                                       |
| status       | enum      | New (default), Qualified, Contacted, Visited, Negotiation, Converted, Dropped |
| notes        | text      | ≤ 1,000 chars                                                                 |
| tags         | string\[] | Optional                                                                      |
| ownerId      | string    | User ID                                                                       |
| updatedAt    | timestamp | Auto updated                                                                  |

### **buyer\_history**

| Field     | Type      | Notes                       |
| --------- | --------- | --------------------------- |
| id        | uuid      | Primary key                 |
| buyerId   | uuid      | FK to buyers                |
| changedBy | string    | User who changed the record |
| changedAt | timestamp | When the change occurred    |
| diff      | json      | Changes made                |

---

## ⚙ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/PRADEEP5967/Buyer-Lead.git
   cd Buyer-Lead
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment**
   Create a `.env` file with:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   NEXTAUTH_SECRET="your-secret"
   NEXT_PUBLIC_APP_NAME="Buyer Lead Intake"
   ```

4. **Run migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the app locally**

   ```bash
   npm run dev
   ```

6. **Optional:** Deploy to Vercel via the dashboard

---

## 📖 Design Notes

### ✅ Validation

* Defined in Zod schemas shared between client and server
* Validations include field length, required/optional rules, and cross-field checks (e.g., budgetMax ≥ budgetMin)

### ✅ SSR vs Client

* List page (`/buyers`) is server-rendered with real pagination, sorting, and filtering for performance and SEO
* Forms use client-side validation for instant feedback but fall back to server checks for safety

### ✅ Ownership Enforcement

* On edit/delete operations, the server checks if the `ownerId` matches the logged-in user
* Others are allowed read access but not modification

### ✅ Rate Limiting

* Simple in-memory store limits per IP/user on create/update routes

---

## ✅ What’s Done vs Skipped

| Feature              | Status | Notes                                       |
| -------------------- | ------ | ------------------------------------------- |
| Create lead          | ✅      | Fully functional                            |
| List with filters    | ✅      | SSR with pagination and sorting             |
| View/Edit            | ✅      | Concurrency check and history view included |
| CSV Import/Export    | ✅      | Transactional import with error reporting   |
| Authentication       | ✅      | Demo magic link implemented                 |
| Validation (Zod)     | ✅      | Client and server validated                 |
| Rate limiting        | ✅      | Basic protection implemented                |
| Accessibility        | ✅      | Labels and error states announced           |
| Testing              | ✅      | Unit test for CSV validator                 |
| Tag chips typeahead  | ✅      | Nice-to-have included                       |
| Status quick-actions | ✅      | Nice-to-have included                       |
| File upload          | ❌      | Skipped for scope and timeline              |

---

## 📂 Repository

👉 [https://github.com/PRADEEP5967/Buyer-Lead](https://github.com/PRADEEP5967/buyer-lead-intake.git)

---
