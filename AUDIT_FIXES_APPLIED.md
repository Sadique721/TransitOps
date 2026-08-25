# Audit Fixes Applied — 2026-07-12

This documents the changes made in response to the full-stack audit report,
covering every item on its Critical and Medium/High findings lists. Nothing
in the "roadmap, not blocking" section (multi-tenancy, Kafka, K8s, etc.) was
touched — those remain intentional future work.

## 🔴 Critical

### 1. Zero test coverage
Added `backend/src/test/java/com/transitops/service/`:
- `TripServiceTest.java` — 10 tests covering `createDraft`, `dispatch`
  (draft-only, vehicle-available, driver-available, license-not-expired,
  cargo-vs-capacity re-check), `complete` (state transition + fuel
  intelligence hook), and `cancel` (restores availability, blocks on
  completed trips).
- `MaintenanceServiceTest.java` — 7 tests covering the maintenance-lock rule
  (blocks on `ON_TRIP`/`RETIRED`, blocks duplicate active records, `close`
  restores `AVAILABLE` unless the vehicle was retired in the meantime).

Run with `cd backend && mvn test`. Uses Mockito + AssertJ, both already
pulled in transitively by `spring-boot-starter-test` — no new test
dependencies needed.

**Not done:** frontend Jest/RTL tests, integration/API-contract tests, or a
CI pipeline to run these automatically — flagged as Medium/roadmap items in
the original audit, not the Critical items this pass targeted.

### 2. No explicit DB migration (relied on `ddl-auto: update`)
- Added Flyway (`flyway-core` + `flyway-mysql` in `pom.xml`).
- Added `backend/src/main/resources/db/migration/V1__init_schema.sql`,
  hand-written to match the current JPA entities exactly (all 7 tables,
  FKs, unique constraints).
- Changed `spring.jpa.hibernate.ddl-auto` from `update` to `validate` —
  Hibernate now only checks entities match the Flyway-owned schema; it can
  no longer silently alter or drop columns.
- Any future schema change must be a new `V2__...sql` file, not a hand-edit
  of `V1` or a return to `ddl-auto: update`.

### 3. Hardcoded Aiven credentials in `.env`
- The real `.env` (with live DB credentials and JWT secret) has been
  **removed from this delivered zip**. Only `.env.example` (placeholder
  values) ships now.
- **Action still required on your end:** rotate the Aiven MySQL password
  that was in the original `.env`, since it passed through this session —
  treat it as no longer secret.

## 🟠 High / Medium

### 4. No rate limiting (OWASP #10)
Added `backend/src/main/java/com/transitops/security/RateLimitFilter.java`
— a per-client-IP, fixed-60s-window limiter, registered ahead of the JWT
filter in `SecurityConfig` so it also protects `/auth/login`. Configurable
via `RATE_LIMIT_ENABLED` / `RATE_LIMIT_RPM` env vars (default 120 req/min).
It's in-memory (no Redis), which is correct for a single instance; the
filter's Javadoc explains what to swap in if you scale to multiple backend
instances.

### 5. CORS allowed all origins (`allowedOriginPatterns = "*"`)
`SecurityConfig` now reads a comma-separated allow-list from
`cors.allowed-origins` (env var `ALLOWED_ORIGINS`), defaulting to
`http://localhost:5173,http://localhost:3000` for local dev. Set this to
your real frontend domain(s) in production.

### 6. Missing DB indexes
Added to `V1__init_schema.sql`: indexes on `vehicles.status`,
`drivers.status`, `drivers.license_expiry_date`, `trips.status`,
`trips.vehicle_id`, `trips.driver_id`, `trips.fuel_theft_suspected`,
`maintenance_logs.vehicle_id` (+ composite with `is_active`),
`expenses.vehicle_id`/`trip_id`, and `audit_logs(entity_name, entity_id)` /
`audit_logs.created_at`.

### 7. N+1 queries in the intelligence services
`TripRepository.findByStatus/findByVehicleId/findByDriverId` now use
`JOIN FETCH` on `vehicle` and `driver`, so `FuelIntelligenceService`,
`DriverPerformanceService`, and `VehicleHealthService` no longer trigger a
separate lazy-load query per trip when they loop over trip lists.

## Not in this pass (unchanged, on purpose)
- MFA, IP whitelisting, session history — audit lists these as roadmap.
- Swagger/OpenAPI docs, Postman collection.
- Frontend tests, CI/CD pipeline.
- Compile verification — this sandbox still can't reach Maven Central
  (`repo.maven.apache.org` isn't on the allowed network list), so `mvn test`
  needs to be run in an environment with normal internet access before you
  fully trust this. The `pom.xml` and all new/changed files were reviewed by
  hand for correctness (braces balanced, imports present, method signatures
  matched against the actual entities/DTOs), but that's not a substitute for
  an actual compile + test run.
