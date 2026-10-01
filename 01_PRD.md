# Product Requirements Document (PRD)
## Travel Discovery Application

**Version:** 1.0
**Status:** Draft for MVP
**Stack:** React.js (Frontend) · Node.js + Express.js (Backend) · PostgreSQL + Prisma ORM (Database)

---

## 1. Purpose

A travel discovery web application that lets a logged-in user search for a destination, view curated hotels, places, attractions, and essential route/location information for that destination — all backed by a self-maintained (admin-curated) database, with no external travel APIs and no booking/payment flow in this MVP.

## 2. Problem Statement

Travelers often need to consult multiple sources (maps, hotel sites, review sites, blogs) to plan a single trip. This app centralizes curated destination information — hotels, attractions, and route data — into one clean, animated, easy-to-browse dashboard.

## 3. Goals & Non-Goals

### Goals (MVP)
- Secure user authentication (login/register)
- A dashboard to search and select a destination
- Display hotels near the selected destination (from internal DB)
- Display destinations, places, and nearby attractions
- Show route/location information for the destination
- Present essential travel information (best time to visit, currency, local tips, safety notes, etc.)
- Polished UI with animations/transitions for a modern feel
- Admin capability to curate/manage destination, hotel, and attraction data

### Non-Goals (MVP)
- No booking or payment processing
- No third-party API integration (Google Places, Booking.com, etc.) — all data is self-maintained
- No real-time chat/support
- No mobile native app (web-responsive only)

## 4. Target Users

| Persona | Description | Key Need |
|---|---|---|
| Traveler | End user planning a trip | Fast discovery of destination, hotels, attractions |
| Admin/Content Manager | Maintains destination data | Simple way to add/update destinations, hotels, attractions |

## 5. User Stories

1. As a user, I want to register and log in securely so my session/preferences are protected.
2. As a user, I want to search for a destination by name so I can quickly find what I'm looking for.
3. As a user, I want to select a destination from search results to view its full details.
4. As a user, I want to see hotels near my selected destination with basic details (name, rating, price range, image, address).
5. As a user, I want to see nearby attractions and places so I can plan my itinerary.
6. As a user, I want to see route/location information (map pin, distance references, region info) for the destination.
7. As a user, I want to see essential travel info (best season, language, currency, local tips) at a glance.
8. As an admin, I want to add/edit/remove destinations, hotels, and attractions through a management interface or API.

## 6. Functional Requirements

### 6.1 Authentication
- FR-1: Users can register with name, email, password.
- FR-2: Users can log in with email/password; JWT-based session issued.
- FR-3: Passwords stored hashed (bcrypt/argon2), never in plaintext.
- FR-4: Logout invalidates the client-side session/token.
- FR-5: Protected routes (dashboard and below) are inaccessible without a valid session.

### 6.2 Dashboard
- FR-6: Search bar to search destinations by name/keyword (debounced, autocomplete-style suggestions).
- FR-7: Destination selection updates the dashboard view to that destination's detail panel.
- FR-8: Hotel list near the selected destination, paginated or infinite-scroll, each with image, name, price range, star rating, short description.
- FR-9: Attractions/places list near the destination with images and short descriptions.
- FR-10: Route/location panel showing an embedded/static map view, coordinates, and how the destination relates to nearby landmarks.
- FR-11: "Essential Travel Info" card: best time to visit, currency, language, local customs/tips, safety notes.

### 6.3 Admin (content management)
- FR-12: Admin-only endpoints/UI to create/update/delete destinations, hotels, attractions.
- FR-13: Role-based access control distinguishing `USER` and `ADMIN`.

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Dashboard search results return in < 500ms for DB of up to ~50k records |
| Usability | Mobile-responsive, accessible (WCAG AA where feasible) |
| Availability | Target 99% uptime for MVP hosting |
| Scalability | Backend stateless, horizontally scalable behind a load balancer |
| Animation | Smooth page transitions, hover/scroll animations (Framer Motion / GSAP) without hurting load performance |
| Maintainability | Clear module boundaries (auth, destinations, hotels, attractions) |
| Data integrity | Prisma schema constraints + DB-level foreign keys |

## 8. Success Metrics

- Time-to-first-result on destination search (target < 1s perceived)
- User registration → first destination search conversion
- Session retention (returning users)
- Admin content coverage (# destinations with complete hotel/attraction data)

## 9. Assumptions

- All destination, hotel, and attraction data is manually curated/seeded by admins — no live external data feed.
- "Route/location information" means static/derived location data (coordinates, region, distance to key points) rendered on a map component, not live turn-by-turn navigation.
- No payment gateway or booking confirmation flow is in scope for MVP.

## 10. Open Questions (flagged for your input later)

- Should the map component use a free tier map tile provider (e.g., Leaflet + OpenStreetMap) since no paid API integration was requested? *(Assumed: yes, see Technical Architecture doc.)*
- Should admin have its own separate UI, or manage content via API/Postman + a simple internal panel for MVP?
- Any specific branding, color palette, or logo to reflect in the animated UI?

## 11. Release Plan (MVP milestones)

1. **M1:** Auth (register/login/JWT/RBAC) + DB schema via Prisma
2. **M2:** Destination search + selection + detail view
3. **M3:** Hotels + Attractions modules with seeded data
4. **M4:** Route/location panel + Essential travel info card
5. **M5:** UI polish — animations/transitions, responsive pass
6. **M6:** Admin CRUD endpoints + basic admin UI
7. **M7:** Security hardening, QA, deployment
