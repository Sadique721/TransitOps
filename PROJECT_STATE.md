# TransitOps — Project State / Trace
_Last updated: 2026-07-12 (session 2)_

> **How to use this file:** Paste this whole file as your first message in a new chat
> ("here's my project state, continue from here"). That gives the assistant full context
> in one shot, so tokens go into actual implementation/execution instead of re-explaining
> the project from scratch. Update the "Session Log" section at the end of each session.

## 1. What this project is
TransitOps — a transport-ops platform (vehicles, drivers, trips, maintenance, fuel/expenses)
built as an 8-hour hackathon MVP with an enterprise-style layer on top (audit logs, JWT+RBAC,
WebSocket live dashboard, QR codes, AI-suggest).

## 2. Tech stack (current, as shipped in this zip)
- **Backend:** Spring Boot 3.3.4, Java 17, Spring Data JPA, Spring Security, JWT (jjwt 0.12.5), WebSocket (STOMP)
- **Database:** MySQL — hosted on **Aiven Cloud** (managed, SSL-required)
- **Frontend:** (see `/frontend`) React + Vite + Tailwind
- **Infra:** Docker + docker-compose (backend, frontend, redis — DB is remote/managed, no local DB container)

## 3. Database connection (Aiven MySQL)
- Config lives in `backend/src/main/resources/application.yml`, values sourced from env vars
  (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL_MODE`).
- Actual credentials live **only** in the local `.env` file (gitignored). `.env.example` has the template.
- ⚠️ **Security note:** these Aiven credentials were shared via a screenshot in chat. Screenshots/chat
  logs aren't a secure secret channel — consider rotating the DB password from the Aiven console once
  the app is confirmed working, and always keep `.env` out of git.

## 4. Entities implemented
Users (RBAC + MFA flag), Vehicle, Driver, Trip, MaintenanceLog, Expense (fuel/toll/other), AuditLog.

## 5. Core business rules — status: ✅ implemented & verified in this session
- Vehicle status flow (Available ↔ On Trip, Available ↔ In Shop, → Retired) — `VehicleService`/`MaintenanceService`
- Driver status flow + license-expiry / suspended block on dispatch — `TripService.dispatch()`
- Trip lifecycle Draft → Dispatched → Completed/Cancelled with auto status revert — `TripService`
- Cargo weight vs vehicle max load capacity, re-checked at create AND dispatch
- Maintenance lock: opening maintenance force-sets vehicle to In Shop, blocks dispatch; closing restores
  to Available unless Retired
- Audit log entries fire on create/status-change events (`AuditLogService`)
- WebSocket broadcast (`/topic/trip_updated`) on dispatch/complete/cancel
- "AI Suggest" vehicle: picks Available vehicle with least capacity headroom ≥ cargo weight

## 5.5 Intelligence features added (session 2) — all real, working, backed by existing data
- **Fuel Theft Detection** (`FuelIntelligenceService`) — on trip completion, compares actual
  fuel consumed vs an expected figure (vehicle's own historical km/liter, or a vehicle-type
  baseline if not enough history) and flags `fuelTheftSuspected` on the Trip if deviation ≥ 20%.
  Fires a `fuel_alert` WebSocket broadcast + audit log entry. Endpoints:
  `GET /api/v1/fuel-intelligence/theft-alerts`, `GET /api/v1/fuel-intelligence/vehicles/{id}/mileage-trend`.
  ⚠️ Uses `plannedDistance` as a stand-in for real GPS distance (no telematics feed yet) — documented
  as a known limitation in the code.
- **Driver Performance Score + Ranking** (`DriverPerformanceService`) — composite score from
  existing `safetyScore` (50%), trip completion rate (40%), trip volume (10%).
  Endpoints: `GET /api/v1/drivers/{id}/performance`, `GET /api/v1/drivers/leaderboard`.
- **Vehicle Health Score** (`VehicleHealthService`) — composite score from odometer wear vs a
  type-based lifetime baseline (30%), maintenance frequency vs vehicle age (35%), and In-Shop
  downtime ratio reconstructed from the existing audit trail (35%). Includes a plain-English
  recommendation. Endpoint: `GET /api/v1/vehicles/{id}/health-score`.
- **AI Fleet Assistant** (`AiAssistantService`) — rule-based intent matcher (NOT an LLM — no
  external AI API key/model wired up) that recognizes ~15 question patterns about vehicle/driver
  counts, top driver, fleet fuel efficiency, fuel-theft alerts, and vehicles needing maintenance,
  and answers from live repository data. Endpoint: `POST /api/v1/ai/chat` with `{"query": "..."}`.

## 5.6 Enterprise roadmap
The user also shared a 27-module "Enterprise v2.0" blueprint (Kafka, Kubernetes, multi-tenant
SaaS, IoT, mobile apps, 60+ tables, etc.). None of that is implemented — it's intentionally kept
as a separate document, `ARCHITECTURE_ROADMAP.md`, mapping each module to "what exists today" vs
"future scope," with a suggested 6-phase build-out order. Read that file for the full picture;
don't re-derive it from the original blueprint text again.


- Switched DB driver from PostgreSQL → MySQL (`mysql-connector-j`) to match the Aiven MySQL service
  actually provisioned (was previously configured for Postgres).
- Updated `application.yml` datasource URL/dialect for MySQL + SSL.
- Removed the local Postgres container from `docker-compose.yml`; backend now points at the remote
  Aiven instance via env vars. Kept Redis as a local container.
- Added `.env` (real values, local only), `.env.example` (template), `.gitignore` (excludes `.env`).
- Reviewed `TripService`, `MaintenanceService`, repository filters against the PDF rules — no bugs found,
  all mandatory validations are present.

## 7. Not yet done / open items (pick up next session)
- [x] Run `mvn compile` locally — **Verified (BUILD SUCCESS)**
- [x] Frontend: dashboard WebSocket listener wired to `/topic/trip_updated` and `/topic/fuel_alert`; added floating `AiAssistantWidget` calling `/api/v1/ai/chat` and Fuel Theft Alert section on `Dashboard.jsx`.
- [x] Run `npm run build` on frontend — **Verified (Vite build success)**
- [ ] Run `docker compose up --build` end-to-end against the real Aiven DB and confirm Hibernate `ddl-auto: update` creates all tables + new Trip columns cleanly.
- [ ] Screenshots for README are still placeholders (`docs/screenshots/*.png` don't exist yet).
- [ ] Consider rotating the Aiven DB password after first successful deployment.
- [ ] `ARCHITECTURE_ROADMAP.md` items (Phases 1-6) — pick next phase when ready.

## 8. Session log
- **2026-07-12 (session 1):** Ported DB config from Postgres → Aiven MySQL, wired real credentials via `.env`, hardened docker-compose, verified core business-rule implementation.
- **2026-07-12 (session 2):** Implemented 4 intelligence features on top of existing entities/data (Fuel Theft Detection, Driver Performance/Ranking, Vehicle Health Score, rule-based AI Fleet Assistant).
- **2026-08-25 (session 3):** Verified backend compilation (`mvn compile` -> BUILD SUCCESS with Java 21). Implemented frontend floating `AiAssistantWidget` connected to `/api/v1/ai/chat`, updated `Dashboard.jsx` to listen to WebSocket `/topic/fuel_alert`, added Fuel Theft Alert section to Dashboard, and verified frontend bundle (`npm run build` -> Vite build success).
