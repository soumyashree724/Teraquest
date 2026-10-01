# Software Workflow Document
## Travel Discovery Application

---

## 1. User Authentication Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant DB as PostgreSQL (Prisma)

    U->>F: Enter email/password (Login form)
    F->>B: POST /api/v1/auth/login
    B->>DB: Find user by email
    DB-->>B: User record (hashed password)
    B->>B: Compare password hash (bcrypt)
    alt Valid credentials
        B->>B: Generate JWT (access + refresh)
        B-->>F: 200 OK + JWT (HttpOnly cookie / body)
        F->>F: Store auth state (Context)
        F->>U: Redirect to /dashboard
    else Invalid credentials
        B-->>F: 401 Unauthorized
        F->>U: Show error message
    end
```

## 2. Destination Search & Selection Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Dashboard
    participant B as Express API
    participant DB as PostgreSQL

    U->>F: Types in search bar
    F->>F: Debounce input (300ms)
    F->>B: GET /api/v1/destinations?query=xyz
    B->>DB: SELECT ... WHERE name ILIKE / trigram match
    DB-->>B: Matching destinations
    B-->>F: 200 OK [destinations]
    F->>U: Show autocomplete/result list
    U->>F: Selects a destination
    F->>B: GET /api/v1/destinations/:id
    B->>DB: Fetch destination + related data
    DB-->>B: Destination detail
    B-->>F: 200 OK {destination}
    F->>U: Render Destination Detail view (animated transition)
```

## 3. Dashboard Data Aggregation Workflow

Once a destination is selected, the frontend fires parallel requests to populate the dashboard panels:

```mermaid
flowchart TD
    A[Destination Selected] --> B{Parallel Fetch}
    B --> C[GET /destinations/:id/hotels]
    B --> D[GET /destinations/:id/attractions]
    B --> E[GET /destinations/:id/travel-info]
    B --> F[GET /destinations/:id -> lat/lng for map]
    C --> G[Render Hotel List - animated cards]
    D --> H[Render Attractions Grid]
    E --> I[Render Travel Info Card]
    F --> J[Render Route/Location Map Panel]
    G & H & I & J --> K[Dashboard fully rendered]
```

React Query manages these calls with independent loading/error states per panel, so one slow/failed request doesn't block the rest of the dashboard.

## 4. Admin Content Management Workflow

```mermaid
sequenceDiagram
    actor Admin
    participant F as Admin UI/API Client
    participant B as Express API
    participant M as RBAC Middleware
    participant DB as PostgreSQL

    Admin->>F: Submit new/updated Destination/Hotel/Attraction
    F->>B: POST/PUT /api/v1/admin/...
    B->>M: Verify JWT + role == ADMIN
    alt Authorized
        M->>B: Pass through
        B->>B: Validate payload (Zod schema)
        B->>DB: Create/Update via Prisma
        DB-->>B: Success
        B-->>F: 200/201 + resource
    else Not authorized
        M-->>F: 403 Forbidden
    end
```

## 5. Overall Application Flow (End-to-End)

```mermaid
flowchart TD
    Start([User visits site]) --> Login{Has valid session?}
    Login -- No --> LoginPage[Login / Register Page]
    LoginPage --> Auth[Authenticate]
    Auth --> Dashboard
    Login -- Yes --> Dashboard[Dashboard]
    Dashboard --> Search[Search Destination]
    Search --> Select[Select Destination]
    Select --> View[View: Hotels, Attractions, Route Info, Travel Info]
    View --> Explore{Explore another destination?}
    Explore -- Yes --> Search
    Explore -- No --> Logout[Logout / End Session]
```

## 6. Error Handling Workflow

- All backend errors funnel through a centralized Express error-handling middleware.
- Errors are categorized: `ValidationError (400)`, `AuthError (401)`, `ForbiddenError (403)`, `NotFoundError (404)`, `ServerError (500)`.
- Frontend uses a global Axios interceptor to catch 401s → auto-redirect to login (session expired) and surface toast notifications for other errors (animated toast component).

## 7. CI/CD Workflow (Recommended)

```mermaid
flowchart LR
    Dev[Developer Push] --> CI[CI Pipeline: Lint + Test + Build]
    CI --> Migrate[Run Prisma Migrations - staging]
    Migrate --> Deploy[Deploy Backend + Frontend]
    Deploy --> Smoke[Smoke Tests]
    Smoke --> Prod[Promote to Production]
```
