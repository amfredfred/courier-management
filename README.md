# CourierMS — Courier Management System

A full-featured courier management system built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router, Server Actions, Server Components)
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)
- **Styling**: Tailwind CSS
- **Email**: Resend (via Supabase Edge Functions)
- **Charts**: Recharts

---

## Features

- ✅ Admin-only authentication
- ✅ Shipment CRUD with auto-generated tracking IDs
- ✅ Tracking timeline / status history
- ✅ Public tracking page (no login required)
- ✅ File upload with Supabase Storage
- ✅ Email notifications on status updates (Resend)
- ✅ Analytics dashboard with charts
- ✅ Automated cron jobs (overdue flagging, cleanup)
- ✅ Pagination, search, status filters

---

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_your_resend_api_key
```

### 3. Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial.sql` in the SQL editor
3. In **Auth → Users**, create an admin user manually (or use the Supabase dashboard invite)
4. Set `enable_signup = false` in Auth settings to block public signups

### 4. Storage

The migration auto-creates the `shipment-attachments` bucket. If needed, create it manually in **Storage** with public access.

### 5. Edge Functions (Email + Cron)

Deploy functions with Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-id
supabase functions deploy send-notification
supabase functions deploy auto-update-shipments
supabase functions deploy cleanup-tasks
```

Set secrets:
```bash
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set APP_URL=https://yourdomain.com
```

Schedule cron jobs in **Supabase Dashboard → Edge Functions → Schedules**:
- `auto-update-shipments`: `0 8 * * *` (daily 08:00 UTC)
- `cleanup-tasks`: `0 2 * * 0` (weekly Sunday 02:00 UTC)

### 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` — redirects to `/auth/login`.

---

## Folder Structure

```
src/
├── app/
│   ├── auth/login/          # Admin login
│   ├── dashboard/
│   │   ├── page.tsx         # Overview
│   │   ├── shipments/       # List, detail, new, edit
│   │   └── analytics/       # Charts
│   ├── track/               # Public tracker
│   └── api/notify/          # Notification proxy
├── components/
│   ├── ui/                  # Button, Input, Badge, etc.
│   ├── dashboard/           # Sidebar, StatCard, Charts
│   ├── shipments/           # Form, StatusModal, Uploader
│   └── tracking/            # Timeline
├── lib/
│   ├── supabase/            # client, server, middleware
│   ├── actions/             # Server Actions
│   └── utils.ts
└── types/                   # Shared TypeScript types
supabase/
├── migrations/              # SQL schema
└── functions/               # Edge Functions (email, cron)
```

---

## Database Schema

| Table | Description |
|-------|-------------|
| `shipments` | Core shipment records with sender/receiver info |
| `tracking_events` | Status history timeline per shipment |
| `attachments` | File metadata linked to shipments |

---

## Email Notifications

Emails are sent via **Resend** through a Supabase Edge Function. Triggered when status is updated via the admin dashboard. The receiver gets an HTML email with tracking link.

To use a different provider, replace the `fetch` call in `supabase/functions/send-notification/index.ts`.
