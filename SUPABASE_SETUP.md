# Craftella — Supabase Backend Setup Guide

This guide explains how to connect your Craftella website to a live **Supabase PostgreSQL** backend, enable file storage, set up authentication, and deploy to production.

---

## 1. Quick Setup (3 Minutes)

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose a name (e.g. `craftella`), set a database password, and select your preferred region.

### Step 2: Run the Database Schema Migration
1. In your Supabase dashboard, navigate to the **SQL Editor** (icon on the left menu).
2. Click **"New Query"**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the editor.
4. Click **"Run"** (or press `Ctrl+Enter`).
5. You should see `Success. No rows returned`.

> This automatically creates:
> - **Tables**: `payment_cards`, `bookings`, `payment_config`, `location_config`
> - **Indexes**: High-performance indexes for bookings, status, and tickets
> - **Row Level Security (RLS)**: Policies allowing guest booking creation, public pass viewing, and admin management
> - **Storage Bucket**: `craftella-assets` for payment QR codes and customer payment receipts
> - **Seed Data**: Default passes, payment UPI configuration, venue details, and demo bookings

### Step 3: Configure Environment Variables
1. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL**
   - **Project API Anon Key** (`anon` `public`)
3. In your local project root, open `.env` (or copy `.env.example` to `.env`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your development server (`npm run dev`).

---

## 2. Authentication & Admin Access

Craftella supports two administrator sign-in methods:

### Method A: Supabase Auth (Recommended)
1. In your Supabase dashboard, go to **Authentication** -> **Users**.
2. Click **"Add user"** -> **"Create user"**.
3. Enter an email (e.g., `admin@craftella.com`) and a strong password.
4. Toggle "Auto Confirm User" to on.
5. You can now log into `/admin/login` directly with this email and password! Sessions are automatically maintained by Supabase Auth with secure refresh tokens.

### Method B: Dedicated Organizer Credentials (Fallback)
If Supabase is offline or still being configured, the dashboard is accessible with the built-in organizer credentials:
- **Admin ID**: `Sravanthi73` (or `admin@craftella.com`)
- **Password**: `7995176068`

---

## 3. Database Schema Overview

| Table | Purpose | RLS Permissions |
|---|---|---|
| `payment_cards` | Workshop passes, prices, themes, and spots | Public: Read active cards. Admins: Insert, Update, Delete |
| `bookings` | Customer bookings, tickets, UTR numbers, receipts | Public: Insert bookings. Admins: View all, update status, delete |
| `payment_config` | UPI ID, Payee name, QR image URL, instructions | Public: Read. Admins: Update |
| `location_config` | 55 Bistro details, timings, Google Maps URL | Public: Read. Admins: Update |

### Storage Bucket: `craftella-assets`
- **Folders**:
  - `qr-codes/`: Admin-uploaded merchant QR images.
  - `receipts/`: Customer payment screenshot uploads during pass booking.
- **Access**: Public read; authenticated/guest upload with 5MB max file size limit.

---

## 4. Production Deployment (e.g., Netlify / Vercel)

When deploying to Netlify or Vercel, add your environment variables in the host dashboard:

1. **Netlify**:
   - Go to **Site Configuration** -> **Environment Variables**.
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Trigger a deploy (`npm run build`).

2. **Vercel**:
   - Go to **Project Settings** -> **Environment Variables**.
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Redeploy the project.

---

## 5. Offline & Local Storage Resilience

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided, Craftella automatically runs in **Local Storage Cache Mode**. The entire website, checkout flow, and admin dashboard remain 100% operational, and seamlessly switch to Supabase PostgreSQL once credentials are added.
