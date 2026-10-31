# Herger's & Co. Clients App

A production-ready client portal for Herger's & Co. built with React, TypeScript, Vite, and Supabase-ready architecture. The app includes:

- mobile-first login and signup screens
- protected client dashboard
- news, bookings, profile, payments, support, and documents sections
- demo local authentication when Supabase environment variables are not yet configured
- Railway deployment configuration for production hosting

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:4173

## Production environment

Create an environment file from the sample:

```bash
cp .env.example .env
```

Then set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase setup

The project includes the DB schema and policy definitions in:

- `supabase/schema.sql`
- `supabase/rls.sql`

These define the core tables needed for client profiles, bookings, documents, support tickets, news, invoices, and notifications.

## Security model

- private data access is restricted by row-level security policies
- user data is isolated by authenticated user ID
- direct database bootstrap operations should run with the service role only when needed
- frontend auth uses Supabase when configured and falls back to a secure local demo mode during development

## Deploy to Railway

This app is configured for Railway through the included `railway.json` and `npm run start` script.

## Build verification

```bash
npm run build
```

This project is already verified to build successfully in the current workspace.
