# SaaS Dashboard - Project Management

A full-stack project management dashboard built with Next.js 16, featuring CRUD operations, real-time notifications, user profiles, comprehensive settings, and responsive design.

## Live Demo

**Try it now:** [https://dashboard-saas-alpha.vercel.app](https://dashboard-saas-alpha.vercel.app)

| | Demo Credentials |
|---|---|
| Email | `demo@example.com` |
| Password | `demo123` |

![Dashboard](docs/screenshots/08-dashboard-overview.png)

## Features

### Core Features
- **Dashboard** - Overview with project statistics, charts, and recent activity
- **Project Management** - Create, read, update, and delete projects
- **Notifications** - Real-time notification system with mark as read/delete
- **Profile** - User profile management with editable fields
- **Settings** - Comprehensive settings for notifications, appearance, privacy, and security
- **Filtering & Search** - Filter projects by status and search by name
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Form Validation** - Client and server-side validation with Zod

### Bonus Features
- **Authentication** - User registration and login with NextAuth.js
- **Protected Routes** - Dashboard requires authentication
- **Session Management** - JWT-based sessions with secure cookies
- **Docker Support** - Containerized deployment with Docker Compose
- **Real-time Notification Badge** - Header shows unread notification count

## Screenshots

### Login Page
Secure authentication with email and password.

![Login](docs/screenshots/01-login.png)

### Register Page
Create new account with name, email, and password.

![Register](docs/screenshots/02-register.png)

### Dashboard
Overview with project statistics, trends chart, status distribution, weekly activity, and recent projects.

![Dashboard Overview](docs/screenshots/08-dashboard-overview.png)

### Projects List
Full CRUD operations with search, status filtering, and pagination.

![Projects List](docs/screenshots/09-projects-list.png)

### Create Project Modal
Form with validation for creating new projects.

![Create Project Modal](docs/screenshots/10-project-create-modal.png)

### Status Filter
Filter projects by status (All, Active, On Hold, Completed).

![Status Filter](docs/screenshots/11-status-filter-dropdown.png)

### Notifications
View, mark as read, and delete notifications with different types (info, success, warning).

![Notifications](docs/screenshots/12-notifications-page.png)

### Profile
User profile with personal information and activity statistics.

![Profile](docs/screenshots/13-profile-page.png)

### Settings
Comprehensive settings for notifications, appearance, privacy, security, and password management.

![Settings](docs/screenshots/14-settings-page.png)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Recharts |

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Docker & Docker Compose (for local PostgreSQL)

## Quick Start with Docker

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/gabrielnejoiu/saas-dashboard.git
cd saas-dashboard

# Start PostgreSQL with Docker
docker compose up -d

# Install dependencies
npm install

# Set up database
npx prisma db push

# Seed with demo data (includes demo user)
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:
- **Email**: `demo@example.com`
- **Password**: `demo123`

## Manual Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gabrielnejoiu/saas-dashboard.git
cd saas-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

For local development with Docker PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_dashboard"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

For production with Supabase:

```env
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"
```

### 4. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 5. Set Up Database

Generate Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

### 6. Seed the Database

Populate the database with sample data and demo user:

```bash
npm run db:seed
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After seeding, you can log in with:
- **Email**: `demo@example.com`
- **Password**: `demo123`

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth layout group
│   │   ├── login/page.tsx         # Login page
│   │   ├── register/page.tsx      # Registration page
│   │   └── layout.tsx             # Auth layout
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx     # Dashboard overview
│   │   ├── projects/page.tsx      # Projects management
│   │   ├── notifications/page.tsx # Notifications
│   │   ├── profile/page.tsx       # User profile
│   │   └── settings/page.tsx      # Settings
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth.js handler
│   │   │   └── register/route.ts       # User registration
│   │   ├── dashboard/route.ts          # Dashboard statistics
│   │   ├── projects/
│   │   │   ├── route.ts                # GET (list), POST (create)
│   │   │   └── [id]/route.ts           # GET, PUT, DELETE
│   │   ├── notifications/
│   │   │   ├── route.ts                # GET, POST (mark all read)
│   │   │   └── [id]/route.ts           # PATCH, DELETE
│   │   └── profile/route.ts            # GET, PUT
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── projects/
│   │   ├── DeleteConfirmDialog.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── ProjectTable.tsx
│   │   └── StatusBadge.tsx
│   ├── providers/
│   │   └── SessionProvider.tsx
│   └── ui/                        # shadcn/ui components
├── hooks/
│   ├── index.ts                  # Barrel export
│   ├── useDebounce.ts            # Debounce hook for search
│   └── useProjects.ts            # Projects CRUD hook
├── lib/
│   ├── api-utils.ts               # API response utilities
│   ├── auth.ts                    # NextAuth configuration
│   ├── auth-helpers.ts            # Auth helper functions
│   ├── prisma.ts                  # Prisma client
│   ├── utils.ts                   # Utility functions
│   └── validators.ts              # Zod schemas
├── middleware.ts                  # Auth middleware
└── types/
    ├── next-auth.d.ts
    └── project.ts
```

## API Endpoints

### Dashboard API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard statistics and charts data |

### Projects API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects (supports `?status=&search=`) |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Notifications API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications (supports `?filter=unread`) |
| POST | `/api/notifications` | Mark all as read (`action: "mark-all-read"`) |
| PATCH | `/api/notifications/:id` | Mark notification as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### Profile API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update user profile |

### Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/signin` | Sign in (NextAuth.js) |
| POST | `/api/auth/signout` | Sign out (NextAuth.js) |
| GET | `/api/auth/session` | Get current session |

### Example Requests

```bash
# Create a new project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "status": "ACTIVE",
    "deadline": "2026-06-15",
    "assignedTo": "John Doe",
    "budget": 15000
  }'

# Get notifications
curl http://localhost:3000/api/notifications

# Mark notification as read
curl -X PATCH http://localhost:3000/api/notifications/abc123 \
  -H "Content-Type: application/json" \
  -d '{"read": true}'
```

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  location: string | null;
  role: string | null;
  department: string | null;
  bio: string | null;
  createdAt: Date;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  deadline: Date;
  assignedTo: string;
  budget: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## Database Setup with Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings > Database**
4. Copy the connection strings:
   - **Connection pooling** (port 6543) → `DATABASE_URL`
   - **Direct connection** (port 5432) → `DIRECT_URL`
5. Add `?pgbouncer=true` to the pooled URL

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL
4. Deploy

### Docker

Build and run with Docker:

```bash
docker build -t saas-dashboard .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  saas-dashboard
```

Or use Docker Compose for production:

```bash
# Set NEXTAUTH_SECRET in environment
export NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Start all services
docker compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with Next.js, TypeScript, and Tailwind CSS.
