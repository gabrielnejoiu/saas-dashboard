# Local Development Setup

Complete guide for setting up the SaaS Dashboard locally.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Docker** & **Docker Compose** (for PostgreSQL)
- **Git**

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/gabrielnejoiu/saas-dashboard.git
cd saas-dashboard

# 2. Install dependencies
npm install

# 3. Start PostgreSQL database
docker compose up -d

# 4. Set up environment variables
cp .env.example .env.local

# 5. Push database schema
npx prisma db push

# 6. Seed with demo data
npm run db:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:
- **Email:** demo@example.com
- **Password:** demo123

---

## Step-by-Step Guide

### 1. Clone Repository

```bash
git clone https://github.com/gabrielnejoiu/saas-dashboard.git
cd saas-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will also run `prisma generate` automatically (postinstall script).

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d
```

This starts PostgreSQL 16 Alpine on port 5432 with:
- **Database:** saas_dashboard
- **User:** postgres
- **Password:** postgres

**Verify it's running:**
```bash
docker compose ps
```

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database (local Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_dashboard"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 5. Set Up Database

**Push schema to database:**
```bash
npx prisma db push
```

**Seed with demo data:**
```bash
npm run db:seed
```

This creates:
- 1 demo user (demo@example.com / demo123)
- 30 sample projects
- 12 notifications

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database (no migration) |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio GUI |

### Prisma Studio

View and edit database records visually:

```bash
npm run db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
# Drop all tables and re-push schema
npx prisma db push --force-reset

# Re-seed data
npm run db:seed
```

---

## Troubleshooting

### Port 5432 Already in Use

```bash
# Check what's using the port
lsof -i :5432

# Stop local PostgreSQL if running
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux
```

### Docker Container Won't Start

```bash
# Remove old containers and volumes
docker compose down -v
docker compose up -d
```

### Prisma Client Errors

```bash
# Regenerate Prisma client
npx prisma generate

# If schema changed, push again
npx prisma db push
```

### Authentication Issues

1. Ensure `NEXTAUTH_SECRET` is set in `.env.local`
2. Ensure `NEXTAUTH_URL` matches your local URL
3. Clear browser cookies and try again

### Database Connection Failed

1. Check Docker container is running: `docker compose ps`
2. Verify DATABASE_URL in `.env.local`
3. Test connection: `npx prisma db pull`

---

## Development Workflow

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` (development)
3. Or `npx prisma migrate dev --name description` (with migration)

### Adding New API Routes

1. Create file in `src/app/api/`
2. Export async functions: GET, POST, PUT, DELETE, PATCH
3. Use utilities from `src/lib/api-utils.ts`

### Adding New Pages

1. Create folder in `src/app/(dashboard)/`
2. Add `page.tsx` file
3. Wrap with `DashboardLayout` component

### Adding Components

1. Create in `src/components/`
2. Use shadcn/ui components from `src/components/ui/`
3. Follow existing patterns for consistency

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| NEXTAUTH_SECRET | Yes | Secret for JWT signing |
| NEXTAUTH_URL | Yes | Base URL of the application |
| DIRECT_URL | No | Direct DB URL for migrations |

---

## IDE Setup

### VS Code Extensions

- **Prisma** - Schema highlighting and formatting
- **ESLint** - Linting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript Vue Plugin (Volar)** - Better TS support

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```
