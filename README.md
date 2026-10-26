# Team Spica — Practice 1 | Flight Status API

FastAPI backend for querying and updating flight statuses stored in an existing Azure PostgreSQL database.

## Prerequisites
- Python compatible with `requirements.txt`
- Access to the existing Azure PostgreSQL database and its `public."PSA_flight_sta"` table

## Local setup

The commands below start from the repository root.

```bash
python -m venv .venv
# PowerShell:
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
# Bash:
./.venv/bin/python -m pip install -r backend/requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and replace the placeholder
values. Never commit `.env`.

```bash
# PowerShell:
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --app-dir backend
# Bash:
./.venv/bin/python -m uvicorn app.main:app --reload --app-dir backend
```

Visit <http://127.0.0.1:8000/docs> for interactive API documentation.

## Endpoints
- `GET /health` — application liveness (does not check DB)
- `GET /flights/` — list flights
- `GET /flights/{flight_number}` — retrieve a flight
- `POST /flights/` — create a flight
- `PATCH /flights/{flight_number}` — update a flight
- `DELETE /flights/{flight_number}` — delete a flight

## Database contract
The existing table, schema, primary key, and `scheduled_time` string storage are **unchanged**. This repository does not run schema creation at startup. If your Azure table differs from `app/models.py`, coordinate a change with the team before editing it.

## Project structure
- `app/main.py`: FastAPI setup and router registration
- `app/database.py`: SQLAlchemy engine and sessions
- `app/models.py`: mapping to the existing database table
- `app/schemas/flights.py`: Pydantic request/response validation
- `app/routers/flights.py`: flight API endpoints
- `Docs/`: problem statement and sample dataset

Practice-only task endpoints and redundant `run.py` entry point were removed from the deployable app.

## backend innit
- step 1: uvicorn app.main:app --reload --app-dir backend
http://127.0.0.1:8000
ctrl + C to end

## frontend innit
- Step 1: cd frontend
- step 2: npm run dev
