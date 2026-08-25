# How to Start TransitOps Enterprise v2.0

Follow these steps to run the complete TransitOps fullstack application on your machine.

---

## 📋 Prerequisites
Ensure you have the following installed on your system:
- **Docker & Docker Compose**: To run containers for Redis, Kafka, and the services.
- **Git**: To manage repository operations.

---

## 🚀 Step-by-Step Launch Guide

### Step 1: Configuration (.env File)
The project contains an `.env` file at the root. We have pre-configured it with the Aiven MySQL database credentials shown on your console screen:
- **Host**: `transitops-ktpl-odoo-transitops-ktpl-odoo.b.aivencloud.com`
- **Port**: `27769`
- **User**: `avnadmin`
- **Password**: `[REDACTED_SECURE_PASSWORD]` (Pre-configured in your local `.env` file)
- **Database**: `defaultdb`

*(Note: The actual `.env` file is excluded from version control to protect these secrets).*

### Step 2: Spin Up Containers (Docker Compose)
Run the following single command from the root `transitops` directory:
```bash
docker compose up --build
```

This starts the entire TransitOps Enterprise network:
1. **`transitops-redis`** (Port `6379`): Cache for tokens, rate limiting, and sessions.
2. **`transitops-zookeeper` & `transitops-kafka`** (Port `9092`): Handles async events like `TripCompletedEvent`.
3. **`transitops-backend`** (Port `8080`): The Spring Boot API. It connects to the Aiven MySQL server, runs Flyway schema migrations on startup, and exposes WebSocket endpoints on `/ws`.
4. **`transitops-frontend`** (Port `5173`): The React + Vite console workspace.

---

## 🖥️ Service URLs

- **Web Console UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **STOMP WebSocket**: `ws://localhost:8080/ws`

---

## 🔑 Initial User Credentials Creation

To create a user and log in, run these commands:

```bash
# 1. Register an Admin Account
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@transitops.com","password":"password123","role":"FLEET_MANAGER"}'

# 2. Authenticate
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@transitops.com","password":"password123"}'
```

Copy the returned `accessToken` and use it as `Authorization: Bearer <token>` for all other API endpoints!
