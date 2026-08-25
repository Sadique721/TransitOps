# TransitOps — Enterprise Architecture Roadmap (v2.0 Vision)

> This document captures the **full enterprise vision** for TransitOps beyond the current
> working MVP. Nothing here is implemented yet — it's a structured target architecture so
> the project can be pitched/scoped as a flagship product, not just a hackathon build.
> For what's actually built and running today, see [`PROJECT_STATE.md`](./PROJECT_STATE.md)
> and the main [`README.md`](./README.md).

---

## 1. Why a separate roadmap doc

The current codebase (Spring Boot + MySQL, ~7 core entities, JWT auth, WebSocket dashboard,
plus the 4 intelligence features added in this session) is a real, working, demo-able system.
The ideas below — 60+ tables, Kafka, Kubernetes, a Python ML microservice, mobile apps — are a
genuine multi-quarter enterprise roadmap, not something to bolt on all at once. Keeping it in
its own doc means:
- The core system stays simple enough to actually run and demo.
- Judges/recruiters/reviewers can see *both* "what works today" and "how far the architecture
  was thought through" without confusing the two.

---

## 2. Target System Architecture (future state)

- **Pattern:** Clean Architecture / DDD, evolving from the current modular monolith toward
  domain-aligned microservices (Fleet, Driver, Trip, Cargo, Finance, Analytics, AI, Notification).
- **Sync communication:** REST (current). GraphQL as an option for the BI/analytics layer.
- **Async communication:** Apache Kafka or RabbitMQ for event-driven workflows — e.g. a
  `TripCompletedEvent` fanning out to Invoicing, Fuel Analytics, Maintenance-check, and
  Notification consumers, instead of one service calling the others directly.
- **State:** Redis for server-side caching/session/rate-limiting; Redux/Zustand on the frontend.
- **Multi-tenancy:** tenant-per-organization, either isolated databases or a shared DB with
  row-level `tenant_id` partitioning + Postgres Row-Level Security.

## 3. Target Technology Stack

| Layer | Options | Purpose |
|---|---|---|
| Backend | Spring Boot 3 (current) / NestJS / FastAPI | Core APIs |
| Event broker | Kafka / RabbitMQ | Async workflows, audit, notifications |
| Primary DB | PostgreSQL + TimescaleDB | Transactional + time-series (IoT/telemetry) |
| Secondary store | MongoDB / Elasticsearch | Documents, manifests, full-text/log search |
| Cache | Redis (cluster) | Session, rate limiting, caching |
| File storage | S3 / MinIO | Vehicle images, documents, dashcam video |
| Frontend | React + Vite (current) → Next.js for SSR | Dashboards, marketing pages |
| Mobile | React Native / Flutter | Driver app, offline-first |
| Realtime | WebSocket/STOMP (current), scaling to a pub-sub backbone | Live tracking, alerts |
| AI/ML | Python microservice (FastAPI + scikit-learn/PyTorch) | Predictive maintenance, route optimization, real NLU for the AI assistant |
| Orchestration | Docker (current) → Kubernetes + Helm | Auto-scaling |
| Observability | Prometheus + Grafana + ELK | Metrics, logs, alerts |

## 4. Module Roadmap (grouped by theme)

Each module below lists: **what exists today** (if anything) → **what full enterprise scope looks like**.

### 4.1 Fleet Intelligence
- **Today:** Vehicle CRUD, status state machine, basic non-IoT Health Score (odometer wear,
  maintenance frequency, In-Shop downtime ratio — see `VehicleHealthService`).
- **Roadmap:** real IoT sensor ingestion (tyre pressure, battery voltage, brake wear, engine
  hours) feeding an ML failure-prediction model; utilization heatmaps; replacement ROI advisor.

### 4.2 Driver Intelligence
- **Today:** Driver CRUD, `safetyScore` field, Performance Score + Leaderboard from completion
  rate + safety score + trip volume (see `DriverPerformanceService`).
- **Roadmap:** telematics-based harsh-braking/over-speed/fatigue detection, shift scheduling,
  attendance/leave management, document vault (license, medical cert, training records),
  rewards/penalty automation tied to payroll.

### 4.3 Smart Trip Planning
- **Today:** Single source→destination trips, planned distance, dispatch/complete/cancel
  lifecycle.
- **Roadmap:** multi-stop trips, real routing engine (OSRM/Google Routes), live traffic and
  weather-aware rerouting, geofencing with deviation alerts, route replay.

### 4.4 Cargo Management *(new domain)*
- **Roadmap:** cargo type/fragility/hazmat flags, temperature-sensitive tracking, digital
  manifests, barcode/QR load-unload scanning, cargo insurance and delivery confirmation.

### 4.5 Warehouse Module *(new domain)*
- **Roadmap:** dock/loading-bay scheduling, unload queueing, WMS/inventory sync, inter-warehouse
  stock transfer.

### 4.6 Fuel Intelligence
- **Today:** Theft-suspicion flagging on trip completion, vehicle mileage trend
  (see `FuelIntelligenceService`).
- **Roadmap:** real fuel-card API import, per-station rate tracking, fuel budgets/forecasts,
  efficiency rankings, cost-per-km reporting — all currently limited by using planned distance
  instead of real GPS distance (see the honesty note in `FuelIntelligenceService`).

### 4.7 Finance Module
- **Roadmap:** revenue/invoice generation, GST/tax automation, payroll (salary/bonus/penalty),
  vendor payments, EMI/loan tracking, depreciation, monthly/yearly P&L.

### 4.8 Business Intelligence
- **Roadmap:** daily/weekly/monthly KPI rollups, utilization heatmaps, forecasting, an
  AI-generated narrative summary ("fleet was 15% less efficient this week due to X"),
  executive and regional dashboards.

### 4.9 AI Module
- **Today:** rule-based "AI Fleet Assistant" — recognizes a fixed set of question patterns
  and answers from live data (see `AiAssistantService`). Explicitly **not** an LLM integration.
- **Roadmap:** replace the intent-matcher with a real hosted LLM given tool access to the same
  repositories; add AI auto-dispatch, AI cost/revenue prediction, AI-generated reports, voice
  assistant for drivers.

### 4.10 Notification Engine
- **Today:** WebSocket broadcast for trip/fuel-alert events; email reminder job scaffold.
- **Roadmap:** SMS, WhatsApp Business API, push notifications, Slack/Teams ops alerts, an
  in-app notification center, reminder scheduler for document expiry.

### 4.11 Document Management
- **Roadmap:** RC/insurance/PUC/permit/fitness/license storage with version history, expiry
  reminders, OCR auto-fill, and government-API verification.

### 4.12 Media Module
- **Roadmap:** vehicle/driver photo galleries, maintenance before/after photos, accident photo
  evidence, dashcam video, voice-note incident reports.

### 4.13 Security Module
- **Today:** JWT + refresh tokens, RBAC via `role` enum, bcrypt password hashing, audit log,
  15-minute session inactivity rule.
- **Roadmap:** TOTP-based MFA, device/session history with remote logout, login alerts, IP
  allow-listing for sensitive roles, field-level permissions, API rate limiting.

### 4.14 Multi-Organization (SaaS)
- **Roadmap:** tenant model, per-tenant data isolation (Postgres RLS or DB-per-tenant),
  subdomain routing.

### 4.15 International Support
- **Roadmap:** i18n, multi-currency, multi-timezone display, country-specific tax rules,
  metric/imperial toggle.

### 4.16 Mobile Features
- **Roadmap:** React Native/Flutter driver + manager apps, offline-first sync, QR scan to
  start a trip, background GPS, camera-based POD, e-signature capture.

### 4.17 Delivery Module
- **Roadmap:** delivery OTP, digital signature, proof-of-delivery photo, delivery rating,
  failed-delivery reason codes.

### 4.18 Audit & Compliance
- **Today:** immutable `audit_logs` table, populated on every status change and business event.
- **Roadmap:** compliance dashboard (red/amber/green), ISO/government report generation,
  inspection history, legal-case tracking.

### 4.19 Automation Engine
- **Roadmap:** event-driven chains (Trip Completed → Invoice → Fuel update → Maintenance
  check → Notification → Dashboard refresh) via Kafka/RabbitMQ instead of direct service calls.

### 4.20 External Integrations
- **Roadmap:** Google Maps/OSRM, GPS device protocols (GT06/TK103), fuel-card APIs, payment
  gateways (Stripe/Razorpay), SMS gateways (Twilio/MSG91), WhatsApp Business API, ERP/CRM
  connectors (SAP, Oracle, Salesforce), Power BI read replicas.

### 4.21 Reporting Engine
- **Today:** structure in place for CSV export (`GET /reports/export/csv`).
- **Roadmap:** Excel/PDF/JSON export, per-domain reports (driver, vehicle, fuel, expense, ROI,
  maintenance, daily ops).

### 4.22 Search Engine
- **Roadmap:** global search bar, saved advanced filters, Elasticsearch-backed fuzzy search,
  natural-language search ("trips with a delayed delivery last month").

### 4.23 Productivity Features
- **Roadmap:** keyboard shortcuts, bulk import/export/update, undo/redo, autosave + draft
  recovery.

### 4.24 IoT Integration
- **Roadmap:** GPS ping ingestion, fuel/tyre-pressure/temperature/door/engine sensors, OBD-II
  diagnostics, dashcam streaming — the real data source that would upgrade Fuel Intelligence
  and Vehicle Health from "basic" to full versions.

### 4.25 Cloud & DevOps
- **Today:** Docker Compose for local/single-node run.
- **Roadmap:** Kubernetes + Helm, CI/CD pipelines, Prometheus/Grafana, ELK logging, automated
  backups, multi-region DR, CDN, load balancing.

### 4.26 Testing Module
- **Roadmap:** unit tests (JUnit) for all business rules, integration tests with
  Testcontainers, Postman/Newman regression suite, Cypress UI tests, JMeter load tests, OWASP
  dependency + ZAP security scans.

### 4.27 "Judge-Winning" Showcase Features
The 15 highest-impact demo features from the original blueprint, with current status:

| Feature | Status |
|---|---|
| AI Fleet Assistant (NL queries) | ✅ Basic rule-based version live |
| Live GPS Tracking + Map | ⏳ Roadmap (needs IoT/GPS feed) |
| AI Auto Dispatch | ⏳ Roadmap (builds on `suggestVehicle`) |
| Predictive Maintenance | ✅ Basic version live (`VehicleHealthService`) |
| Fuel Theft Detection | ✅ Basic version live (`FuelIntelligenceService`) |
| Real-Time Alerts (WebSocket) | ✅ Live (`trip_updated`, `fuel_alert` topics) |
| Executive Analytics Dashboard | ⏳ Roadmap |
| Driver Mobile App | ⏳ Roadmap |
| QR Code + Document Scanner | 🟡 QR code generation exists; scanning/document OCR is roadmap |
| Workflow Automation Engine | ⏳ Roadmap (needs event broker) |
| Proof of Delivery | ⏳ Roadmap |
| Complete Audit Trail | ✅ Live (`audit_logs`) |
| Multi-Tenant SaaS | ⏳ Roadmap |
| IoT Device Integration | ⏳ Roadmap |
| Enterprise Security (MFA etc.) | 🟡 JWT/RBAC live; MFA/session history is roadmap |

---

## 5. Suggested Phasing

1. **Phase 1 (done):** Core MVP — vehicles, drivers, trips, maintenance, expenses, JWT, audit,
   WebSocket dashboard.
2. **Phase 2 (done, this session):** Basic Fleet/Driver/Fuel intelligence + rule-based AI
   assistant, all built on existing data — no new infrastructure required.
3. **Phase 3:** IoT ingestion + IoT-driven upgrades to Health Score and Fuel Intelligence;
   real routing/geofencing.
4. **Phase 4:** Event broker (Kafka/RabbitMQ) + automation engine; Finance + Cargo + Warehouse
   modules.
5. **Phase 5:** Multi-tenant SaaS conversion, mobile apps, real LLM-backed AI assistant.
6. **Phase 6:** Full DevOps maturity — Kubernetes, observability stack, DR, security hardening
   (MFA, session history, IP allow-listing, pen testing).
