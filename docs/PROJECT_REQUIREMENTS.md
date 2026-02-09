# Mini SaaS Dashboard - Project Requirements

> **Document Version:** 1.0
> **Created:** February 9, 2026
> **Type:** Interview Technical Assessment
> **Deadline:** 7 days from start

---

## 1. Project Overview

### Objective
Build a simple web dashboard for project management with the ability to:
- **List** projects in a table view
- **Filter** projects by status
- **Search** projects
- **Add** new projects via modal form
- **Edit** existing projects via modal form

### Project Entity Fields (Required)

| Field | Type | Description | Example Values |
|-------|------|-------------|----------------|
| `id` | UUID/String | Unique identifier | Auto-generated |
| `name` | String | Project name | "Website Redesign" |
| `status` | Enum | Project status | "active", "on_hold", "completed" |
| `deadline` | Date | Project deadline | "2026-03-15" |
| `assignedTo` | String | Team member name | "John Doe" |
| `budget` | Number | Project budget | 15000.00 |

---

## 2. Frontend Requirements

### Technology Stack
| Component | Choice | Justification |
|-----------|--------|---------------|
| Framework | **Next.js 14+** | App Router, SSR, API routes built-in |
| Styling | **Tailwind CSS** | Rapid development, responsive utilities |
| State Management | React hooks / Zustand | Simple, no boilerplate |
| Form Handling | React Hook Form + Zod | Type-safe validation |
| UI Components | shadcn/ui | Accessible, customizable |

### UI Components Required

#### 2.1 Dashboard Layout
- Responsive sidebar/header navigation
- Main content area for project table
- Mobile-friendly hamburger menu

#### 2.2 Projects Table
- Column headers: Name, Status, Deadline, Assigned To, Budget, Actions
- Sortable columns (optional bonus)
- Pagination or infinite scroll for large datasets
- Responsive: card view on mobile

#### 2.3 Filter & Search Bar
- **Status Filter:** Dropdown/tabs for "All", "Active", "On Hold", "Completed"
- **Search Input:** Real-time search by project name
- Clear filters button

#### 2.4 Modal Form (Add/Edit)
- Fields: Name, Status (dropdown), Deadline (date picker), Assigned To, Budget
- Form validation with error messages
- Submit and Cancel buttons
- Loading state during submission

### Responsive Breakpoints
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, cards |
| Tablet | 640px - 1024px | Compact table |
| Desktop | > 1024px | Full table with sidebar |

---

## 3. Backend Requirements

### Technology Stack
| Component | Choice | Justification |
|-----------|--------|---------------|
| Runtime | **Node.js 20+** | Modern LTS |
| API | **Next.js API Routes** | Unified codebase, serverless-ready |
| Database | **PostgreSQL via Supabase** | Relational data, free tier, easy deployment |
| ORM | **Prisma** | Type-safe, migrations, excellent DX |

### API Endpoints (RESTful)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/projects` | List all projects | Query: `?status=active&search=term` |
| `GET` | `/api/projects/:id` | Get single project | - |
| `POST` | `/api/projects` | Create project | `{ name, status, deadline, assignedTo, budget }` |
| `PUT` | `/api/projects/:id` | Update project | `{ name?, status?, deadline?, assignedTo?, budget? }` |
| `DELETE` | `/api/projects/:id` | Delete project | - |

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### Database Schema (Prisma)
```prisma
model Project {
  id         String   @id @default(cuid())
  name       String
  status     Status   @default(ACTIVE)
  deadline   DateTime
  assignedTo String
  budget     Decimal  @db.Decimal(10, 2)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Status {
  ACTIVE
  ON_HOLD
  COMPLETED
}
```

### Data Seeding
- Generate 20-50 dummy projects using Faker.js
- Seed script: `npm run db:seed`
- Diverse statuses, realistic dates, varied budgets

---

## 4. Bonus Features (Prioritized)

### Priority 1: Must Have for Strong Impression
- [x] GitHub repository with clean commit history
- [x] Comprehensive README with setup instructions
- [ ] Deployment to Vercel + Supabase

### Priority 2: High Value
- [ ] JWT Authentication (NextAuth.js)
  - Login/Register pages
  - Protected routes
  - User session management
- [ ] Docker containerization
  - `Dockerfile` for production build
  - `docker-compose.yml` for local development

### Priority 3: Nice to Have
- [ ] Dark mode toggle
- [ ] Export to CSV
- [ ] Bulk actions (delete multiple)
- [ ] Activity log / audit trail

---

## 5. Project Structure

```
dashboard-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected dashboard
│   │   │   ├── layout.tsx
│   │   │   └── projects/
│   │   │       └── page.tsx
│   │   ├── api/               # API routes
│   │   │   └── projects/
│   │   │       ├── route.ts   # GET (list), POST (create)
│   │   │       └── [id]/
│   │   │           └── route.ts # GET, PUT, DELETE
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing/redirect
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── projects/
│   │   │   ├── ProjectTable.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   └── ProjectCard.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── validators.ts      # Zod schemas
│   │   └── utils.ts           # Helper functions
│   │
│   └── types/
│       └── project.ts         # TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
├── docs/                       # Documentation
├── .env.local                  # Local environment (gitignored)
├── .env.example               # Environment template
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 6. Development Phases

### Phase 1: Foundation (Day 1-2)
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up Supabase project and Prisma
- [ ] Create database schema and run migrations
- [ ] Implement seed script with dummy data

### Phase 2: Backend API (Day 2-3)
- [ ] Implement CRUD API routes
- [ ] Add input validation with Zod
- [ ] Test endpoints with Thunder Client/Postman
- [ ] Error handling and response formatting

### Phase 3: Frontend Core (Day 3-5)
- [ ] Dashboard layout (sidebar, header)
- [ ] Projects table component
- [ ] Filter and search functionality
- [ ] Add/Edit modal with form validation
- [ ] Connect frontend to API
- [ ] Loading and error states

### Phase 4: Polish & Bonus (Day 5-6)
- [ ] Responsive design testing
- [ ] Authentication implementation
- [ ] Docker setup
- [ ] Code cleanup and comments

### Phase 5: Deployment & Docs (Day 6-7)
- [ ] Deploy to Vercel
- [ ] Configure production Supabase
- [ ] Write comprehensive README
- [ ] Final testing
- [ ] Submit

---

## 7. Evaluation Criteria Mapping

| Criteria | How We Address It |
|----------|-------------------|
| **Code Quality** | TypeScript strict mode, ESLint, consistent patterns, clean architecture |
| **Version Control** | Feature branches, conventional commits, meaningful PR descriptions |
| **Documentation** | README with setup/usage, inline code comments, this spec document |
| **Functionality** | All CRUD operations, filtering, search, responsive design |
| **Bonus** | Authentication, deployment, Docker, additional features |

---

## 8. Environment Variables

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"

# NextAuth (for bonus auth)
NEXTAUTH_SECRET="[GENERATE_SECRET]"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 9. Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches

### Commit Convention
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(api): add project CRUD endpoints
- feat(ui): implement project table with filtering
- fix(form): resolve validation error on budget field
- docs: add setup instructions to README
```

---

## 10. Acceptance Checklist

### Core Requirements
- [ ] Projects can be listed in a table view
- [ ] Projects can be filtered by status
- [ ] Projects can be searched by name
- [ ] New projects can be added via modal
- [ ] Existing projects can be edited via modal
- [ ] All 4 required fields present (status, deadline, assignedTo, budget)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] API endpoints return proper JSON responses
- [ ] Data persists in PostgreSQL database

### Bonus Requirements
- [ ] Authentication implemented
- [ ] GitHub repo with commit history
- [ ] README with setup instructions
- [ ] Deployed to production
- [ ] Docker configuration included

---

*This document serves as the single source of truth for project requirements.*
