# Architecture Decision Records (ADR)

This document captures the key architectural decisions made for the Mini SaaS Dashboard project.

---

## ADR-001: Next.js 14+ with App Router

### Status
Accepted

### Context
We need to choose a frontend framework that can:
- Handle both frontend and backend (API routes)
- Support server-side rendering for SEO
- Deploy easily to serverless platforms
- Have excellent developer experience

### Decision
Use **Next.js 14+** with the App Router.

### Rationale
1. **Unified codebase** - Frontend and API routes in one project
2. **App Router** - Modern React Server Components support
3. **Vercel deployment** - Zero-config deployment included
4. **TypeScript native** - First-class TypeScript support
5. **Industry standard** - Widely used, well-documented

### Alternatives Considered
- **React + Express**: More setup, separate deployments
- **Remix**: Great but less ecosystem maturity
- **Vite + Node**: More configuration needed

---

## ADR-002: Supabase as Database Provider

### Status
Accepted

### Context
We need a PostgreSQL database that:
- Has a free tier for development
- Provides easy deployment
- Supports connection pooling
- Has good developer experience

### Decision
Use **Supabase** for PostgreSQL hosting.

### Rationale
1. **Free tier** - Generous free tier (500MB, 2 projects)
2. **Instant setup** - Database ready in minutes
3. **Connection pooling** - Built-in for serverless compatibility
4. **Dashboard** - Visual database management
5. **Recommended** - Explicitly mentioned in task as easy option

### Alternatives Considered
- **PlanetScale**: MySQL only, no PostgreSQL
- **Railway**: Free tier limited
- **Self-hosted**: Too much overhead for interview

---

## ADR-003: Prisma as ORM

### Status
Accepted

### Context
We need a database access layer that:
- Provides type safety
- Handles migrations
- Works well with TypeScript
- Has good developer experience

### Decision
Use **Prisma** as the ORM.

### Rationale
1. **Type safety** - Auto-generated TypeScript types
2. **Schema-first** - Clear, declarative schema definition
3. **Migrations** - Built-in migration system
4. **Prisma Studio** - Visual data browser
5. **Supabase compatible** - Works seamlessly

### Alternatives Considered
- **Drizzle**: Newer, less documentation
- **TypeORM**: More verbose, decorator-based
- **Raw SQL**: No type safety, error-prone

---

## ADR-004: Tailwind CSS + shadcn/ui

### Status
Accepted

### Context
We need a styling solution that:
- Enables rapid development
- Produces responsive designs
- Has accessible components
- Is maintainable

### Decision
Use **Tailwind CSS** with **shadcn/ui** components.

### Rationale
1. **Rapid development** - Utility-first speeds up styling
2. **Responsive** - Built-in responsive utilities
3. **shadcn/ui** - Copy-paste accessible components
4. **Customizable** - Full control over components
5. **Required** - Task explicitly mentions Tailwind

### Alternatives Considered
- **Material UI**: Heavier, less customizable
- **Chakra UI**: Good but larger bundle
- **Plain CSS**: Slower development

---

## ADR-005: RESTful API over GraphQL

### Status
Accepted

### Context
We need to decide between REST and GraphQL for our API.

### Decision
Use **RESTful API** endpoints.

### Rationale
1. **Simplicity** - Simpler for CRUD operations
2. **Familiarity** - More widely understood
3. **Caching** - Easier HTTP caching
4. **Next.js native** - API routes are REST-oriented
5. **Sufficient** - No complex data fetching needs

### Alternatives Considered
- **GraphQL**: Overkill for simple CRUD
- **tRPC**: Good but adds complexity

---

## ADR-006: Zod for Validation

### Status
Accepted

### Context
We need runtime validation for API inputs.

### Decision
Use **Zod** for schema validation.

### Rationale
1. **TypeScript native** - Infers types from schemas
2. **Runtime safety** - Validates at runtime
3. **Clear errors** - Good error messages
4. **React Hook Form** - Integrates with `@hookform/resolvers`
5. **Standard** - De facto standard in Next.js ecosystem

### Alternatives Considered
- **Yup**: Less TypeScript-native
- **Joi**: Node.js focused, heavier
- **Manual validation**: Error-prone

---

## ADR-007: NextAuth.js for Authentication (Bonus)

### Status
Proposed (for bonus implementation)

### Context
If implementing authentication bonus, we need an auth solution.

### Decision
Use **NextAuth.js** (Auth.js) for authentication.

### Rationale
1. **Next.js native** - Built for Next.js
2. **Multiple providers** - Supports credentials, OAuth
3. **Session handling** - Built-in session management
4. **Middleware** - Easy route protection
5. **Type safe** - Good TypeScript support

### Alternatives Considered
- **Supabase Auth**: Good but different patterns
- **Clerk**: Paid features
- **Custom JWT**: More work, security risks

---

## ADR-008: Vercel for Deployment

### Status
Proposed (for deployment)

### Context
We need a hosting platform for the application.

### Decision
Use **Vercel** for deployment.

### Rationale
1. **Zero config** - Automatic Next.js deployment
2. **Free tier** - Sufficient for demo
3. **Preview deployments** - PR previews
4. **Edge functions** - Serverless at edge
5. **Recommended** - Standard for Next.js

### Alternatives Considered
- **Netlify**: Good but less Next.js optimized
- **Railway**: Good but more setup
- **AWS**: Too complex for interview project

---

## Summary Table

| Decision | Choice | Key Reason |
|----------|--------|------------|
| Framework | Next.js 14+ | Unified frontend + backend |
| Database | Supabase PostgreSQL | Free tier, easy setup |
| ORM | Prisma | Type safety, migrations |
| Styling | Tailwind + shadcn/ui | Rapid development |
| API Style | REST | Simplicity |
| Validation | Zod | TypeScript integration |
| Auth | NextAuth.js | Next.js native |
| Hosting | Vercel | Zero config deployment |
