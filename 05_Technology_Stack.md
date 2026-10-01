# Technology Stack Document
## Travel Discovery Application

---

## 1. Overview — PERN Stack + Animation Layer

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | **React.js** (Vite) | SPA UI |
| Frontend Routing | React Router v6 | Client-side routing/guards |
| Frontend State | React Query + Context API | Server-state caching + auth/global state |
| Animation | Framer Motion, GSAP (optional) | Page transitions, hover/scroll effects |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Maps | Leaflet.js + OpenStreetMap tiles | Route/location panel (no paid API) |
| Backend | **Node.js** + **Express.js** | REST API server |
| Validation | Zod | Request payload validation |
| Auth | jsonwebtoken, bcrypt/argon2 | JWT auth + password hashing |
| ORM | **Prisma ORM** | Type-safe DB access, migrations |
| Database | **PostgreSQL** | Relational data store |
| Caching (optional) | Redis | Token blacklist / hot search caching |
| Containerization | Docker | Consistent dev/prod environments |
| Reverse Proxy | Nginx | TLS termination, load balancing |
| CI/CD | GitHub Actions | Lint/test/build/deploy pipeline |
| Monitoring | Sentry / Pino logs | Error tracking, structured logging |

## 2. Frontend Stack Detail

- **React.js 18+** — component-based UI, functional components + hooks
- **Vite** — fast dev server & build tool (replaces CRA)
- **React Router DOM v6** — routing, `ProtectedRoute` for auth-gated pages
- **TanStack React Query** — data fetching, caching, background refresh for destinations/hotels/attractions
- **Axios** — HTTP client with interceptors (auth header injection, 401 handling)
- **Tailwind CSS** — rapid, consistent, responsive styling
- **Framer Motion** — declarative animations: page transitions, card entrance animations, modal/drawer transitions
- **Leaflet.js + React-Leaflet** — interactive map rendering using free OpenStreetMap tiles for the route/location panel
- **React Hook Form + Zod resolver** — form handling and client-side validation for login/register

## 3. Backend Stack Detail

- **Node.js (LTS, 20.x+)** — JavaScript runtime
- **Express.js** — minimal, unopinionated REST framework
- **Prisma ORM** — schema-first data modeling, type-safe query client, migration tooling
- **PostgreSQL 15+** — relational database; supports `pg_trgm` extension for fuzzy destination search
- **jsonwebtoken** — JWT issuing/verification
- **bcrypt** (or **argon2**) — password hashing
- **Zod** — schema validation for request bodies (shared logic style with frontend if desired)
- **Helmet** — secure HTTP headers
- **cors** — cross-origin resource sharing configuration
- **express-rate-limit** — brute-force protection on auth routes
- **Pino** (or Winston) — structured logging
- **dotenv** — environment variable management

## 4. Database & ORM Detail

- **PostgreSQL** chosen for strong relational integrity (destinations ↔ hotels ↔ attractions ↔ travel info), JSON support if needed for flexible fields, and mature extension ecosystem (`pg_trgm` for search).
- **Prisma ORM**:
  - `schema.prisma` as single source of truth for models
  - `prisma migrate dev` / `prisma migrate deploy` for schema versioning
  - `prisma db seed` for populating admin-curated destination/hotel/attraction data
  - Type-safe generated client consumed directly by Express controllers/services

## 5. DevOps & Tooling

| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Local dev parity (Node + Postgres containers) |
| GitHub Actions | CI: lint, test, build; CD: deploy on merge to main |
| ESLint + Prettier | Code quality & consistent formatting |
| Jest / Vitest + Supertest | Unit & API integration testing |
| Postman / Thunder Client | Manual API testing during development |
| Sentry | Frontend + backend error monitoring |

## 6. Suggested Hosting (MVP → Production)

| Component | Suggested Host |
|---|---|
| Frontend (static build) | Vercel / Netlify |
| Backend (Node/Express) | Render / Railway / AWS ECS |
| Database (PostgreSQL) | Supabase / Railway / AWS RDS |
| Redis (optional) | Upstash / Redis Cloud |

## 7. Why This Stack

- **React + Express + Node + PostgreSQL + Prisma (PERN)** is a proven, well-documented combination with strong TypeScript/JS-ecosystem cohesion end-to-end.
- **Prisma** dramatically reduces boilerplate and injection risk versus raw SQL or a query builder, while keeping full control since there's no external data API dependency.
- **PostgreSQL** offers the relational integrity needed for the destination → hotel/attraction/travel-info structure, plus built-in fuzzy search support for the search bar.
- **Framer Motion + Tailwind** deliver the requested animation/effects layer without heavy custom CSS, keeping the codebase maintainable for an MVP timeline.
