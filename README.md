# Mini SaaS Dashboard

A full-stack project management dashboard built with Next.js, featuring CRUD operations, filtering, search, and responsive design.

## Features

- **Project Management**: Create, read, update, and delete projects
- **Filtering & Search**: Filter projects by status and search by name
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: UI updates immediately after CRUD operations
- **Form Validation**: Client and server-side validation with Zod

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Validation | Zod |
| Forms | React Hook Form |

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- PostgreSQL database (or Supabase account)

## Getting Started

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

Edit `.env.local` with your database credentials:

```env
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 4. Set Up Database

Generate Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── projects/
│   │       └── page.tsx      # Main projects page
│   ├── api/
│   │   └── projects/
│   │       ├── route.ts      # GET (list), POST (create)
│   │       └── [id]/
│   │           └── route.ts  # GET, PUT, DELETE
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
│   └── ui/                   # shadcn/ui components
├── hooks/
│   └── useProjects.ts        # Custom hook for project state
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── utils.ts              # Utility functions
│   └── validators.ts         # Zod schemas
└── types/
    └── project.ts            # TypeScript interfaces
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects (supports `?status=&search=`) |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Example Request

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
```

## Data Model

```typescript
interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  deadline: Date;
  assignedTo: string;
  budget: number;
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

## Screenshots

### Desktop View
The dashboard features a sidebar navigation, header with user menu, and a data table with filtering capabilities.

### Mobile View
On mobile devices, the sidebar becomes a slide-out drawer, and projects are displayed as cards for better readability.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t saas-dashboard .
docker run -p 3000:3000 saas-dashboard
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
