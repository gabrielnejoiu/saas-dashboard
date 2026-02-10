# Production Deployment Guide

Complete guide for deploying the SaaS Dashboard to production using Vercel and Supabase.

## Overview

This guide covers:
- Setting up Supabase PostgreSQL database
- Deploying to Vercel
- Configuring environment variables
- Seeding production data

---

## Prerequisites

- GitHub account (for Vercel integration)
- [Supabase](https://supabase.com) account (free tier available)
- [Vercel](https://vercel.com) account (free tier available)
- Node.js 18+ installed locally

---

## Part 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `saas-dashboard` (or your preferred name)
   - **Database Password:** Generate a strong password and **save it**
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (1-2 minutes)

### 1.2 Get Connection Strings

Navigate to **Project Settings** → **Database** → **Connection string**

You'll need TWO connection strings:

#### Direct Connection (for local development & migrations)
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Transaction Pooler (for Vercel serverless - REQUIRED)
1. In the Connection string section, select **"Transaction pooler"** mode
2. Copy the connection string:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

> **Important:** Vercel serverless functions CANNOT use the direct connection. You MUST use the Transaction Pooler URL for production.

### 1.3 Connection String Comparison

| Type | Host | Port | Username | Use Case |
|------|------|------|----------|----------|
| Direct | `db.[ref].supabase.co` | 5432 | `postgres` | Local dev, migrations |
| Pooler | `aws-0-[region].pooler.supabase.com` | 6543 | `postgres.[ref]` | Vercel, serverless |

### 1.4 Push Schema to Supabase

From your local machine:

```bash
# Set the direct connection URL temporarily
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Push the Prisma schema
npx prisma db push

# Seed with demo data
npm run db:seed
```

---

## Part 2: Vercel Setup

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate via browser or email.

### 2.3 Link Project

From the project root:

```bash
vercel link
```

- Select your Vercel account/team
- Choose to link to existing project or create new
- If creating new, use the project name (e.g., `saas-dashboard`)

### 2.4 Configure Environment Variables

Add the required environment variables to Vercel:

```bash
# Database URL (Transaction Pooler - IMPORTANT!)
printf 'postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true' | vercel env add DATABASE_URL production

# NextAuth Secret (generate a secure one)
printf "$(openssl rand -base64 32)" | vercel env add NEXTAUTH_SECRET production

# NextAuth URL (your production domain)
printf 'https://your-app.vercel.app' | vercel env add NEXTAUTH_URL production
```

Or add them via the Vercel dashboard:
1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for the **Production** environment

#### Required Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase Transaction Pooler URL |
| `NEXTAUTH_SECRET` | `[random-32-char-string]` | Secret for JWT signing |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |

### 2.5 Deploy to Production

```bash
vercel --prod
```

The first deployment will:
1. Build the Next.js application
2. Generate Prisma client
3. Deploy to Vercel's edge network

### 2.6 Verify Deployment

After deployment completes:

1. Visit your deployment URL
2. Try logging in with: `demo@example.com` / `demo123`
3. Verify projects load correctly

---

## Part 3: Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to your project **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 3.2 Update NEXTAUTH_URL

After adding a custom domain, update the environment variable:

```bash
vercel env rm NEXTAUTH_URL production --yes
printf 'https://yourdomain.com' | vercel env add NEXTAUTH_URL production
vercel --prod
```

---

## Troubleshooting

### "Can't reach database server"

**Cause:** Using direct connection URL instead of pooler URL.

**Fix:** Ensure DATABASE_URL uses the Transaction Pooler:
- Host should be: `aws-0-[region].pooler.supabase.com`
- Port should be: `6543`
- Username should be: `postgres.[project-ref]`
- Add `?pgbouncer=true` to the URL

### "Invalid email or password" on Login

**Cause:** Database not seeded with demo user.

**Fix:** Seed the production database:
```bash
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
npm run db:seed
```

### "Configuration" Error on Login

**Cause:** NextAuth.js can't connect to database.

**Fix:**
1. Verify DATABASE_URL is correct in Vercel
2. Ensure using pooler URL (port 6543)
3. Redeploy: `vercel --prod`

### Environment Variables Not Working

**Cause:** Variables may have trailing newlines or spaces.

**Fix:** Use `printf` instead of `echo` when setting via CLI:
```bash
# Wrong (may add newline)
echo "value" | vercel env add VAR production

# Correct
printf 'value' | vercel env add VAR production
```

### Prisma Client Issues

**Fix:** Force a clean rebuild:
```bash
vercel --prod --force
```

---

## Maintenance

### Updating the Application

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Deploy to production
vercel --prod
```

### Database Migrations

For schema changes in production:

```bash
# Use direct URL for migrations
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Create and apply migration
npx prisma migrate deploy
```

### Viewing Logs

```bash
# View recent logs
vercel logs your-app.vercel.app

# View specific deployment logs
vercel inspect [deployment-url] --logs
```

### Checking Environment Variables

```bash
vercel env ls
```

---

## Security Checklist

- [ ] Use strong, unique `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use strong Supabase database password
- [ ] Enable Row Level Security (RLS) in Supabase if needed
- [ ] Keep environment variables secret (never commit to git)
- [ ] Use HTTPS (automatic with Vercel)
- [ ] Regularly rotate secrets

---

## Cost Considerations

### Vercel Free Tier
- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions included

### Supabase Free Tier
- 500MB database storage
- 2GB bandwidth/month
- Unlimited API requests
- Shared CPU

Both free tiers are sufficient for development and small production workloads.
