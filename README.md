# BudgetBruh

A smart budgeting web app with spending analysis, budget planning, carbon footprint from spending, and subscription tracking. Built for TartanHacks (Error 404).

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Python 3, FastAPI
- **Database:** Firebase Firestore (auth, users, transactions, budget plans)

## Project Structure

```
├── frontend/                 # Vite + React app
│   ├── src/
│   │   ├── api/              # API clients (auth, budget, carbon, config)
│   │   ├── pages/            # Signup, Login, Dashboard, Budget, Carbon, Subscriptions, etc.
│   │   └── ...
│   └── public/
│       └── subscription-icons/   # Add your SVG icons here (see README inside)
├── server/                   # FastAPI backend
│   ├── routes/               # auth, transactions, analysis, budget_planner, carbon, target, reflection
│   ├── models/               # User, transaction, goal state, ML models
│   ├── database.py           # Firestore init and client
│   ├── auth_utils.py         # JWT, password hashing (PBKDF2)
│   └── requirements.txt
├── .env                      # Not in repo; copy from server/.env.example
└── README.md
```

## Prerequisites

- **Node.js** (v18+) and **npm**
- **Python** 3.10+
- **Firebase** project with Firestore enabled
- Firebase **service account** JSON (from Firebase Console → Project settings → Service accounts → Generate new private key)

## Setup

### 1. Backend (server)

```bash
cd server
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create `server/.env` (never commit it):

```env
# Paste the FULL service account JSON as one line (no newlines).
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project",...}

# Optional: JWT secret for auth (use a strong value in production)
JWT_SECRET=your-secret-key
```

You can copy `server/.env.example` and fill in the values.

### 2. Frontend

```bash
cd frontend
npm install
```

Optional: create `frontend/.env` if you need to point to a different API:

```env
VITE_API_URL=http://localhost:8000
```

## Running the App

**Terminal 1 – backend:**

```bash
cd server
.venv\Scripts\activate
uvicorn main:app --reload
```

API: **http://localhost:8000**

**Terminal 2 – frontend:**

```bash
cd frontend
npm run dev
```

App: **http://localhost:5173**

## Main Features

- **Auth:** Sign up / Log in (email, password, name, phone). JWT stored in localStorage; used for dashboard and API calls that take `user_email`.
- **Spending Analysis:** Total spend, savings card (synced with Budget Planner goal/reason), pie chart by category, weekly spending pattern.
- **Budget Manager:** Income/expenses/savings from transactions; category limits (user-editable); savings goal and reason; filter by **last N records** (e.g. Last 10, 25, 50, 100).
- **Carbon Emissions:** Footprint from spending (category emission factors); pie chart by category; bar chart for Low/Medium/High impact; filter by **last N records**.
- **Subscription Manager:** List of subscriptions (amount, last paid, renewal); total monthly cost; Remove button links to each platform’s cancellation page. Icons are loaded from `frontend/public/subscription-icons/` via a path dictionary in the code.
- **User Settings:** Notification toggles (e.g. subscription reminders).

## API Overview

| Area        | Endpoints |
|------------|-----------|
| Auth       | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me` |
| Transactions | `GET /transactions?user_email=...` |
| Analysis   | `GET /analysis?user_email=...` |
| Budget     | `GET /generate_budget?user_email=...&last_n=...`, `GET /budget_plan?user_email=...`, `POST /update_budget?user_email=...` |
| Carbon     | `GET /carbon/footprint?user_email=...&last_n=...`, `GET /carbon/factors` |
| Targets / Reflection | See `server/routes/` |

All user-scoped endpoints use the `user_email` query parameter (from the logged-in user on the frontend).

## Subscription Icons

Place your own SVG (or image) files in **`frontend/public/subscription-icons/`**.  
The app uses a path dictionary in `SubscriptionManagerTab.tsx` (`SUBSCRIPTION_ICON_PATHS`). Add or change entries there to match your filenames (e.g. `spotify.svg`, `netflix.svg`). See `frontend/public/subscription-icons/README.md` for expected keys and how to add new ones.

## Environment Notes

- **Firebase:** Credentials must be set via `FIREBASE_SERVICE_ACCOUNT_JSON` in `server/.env` (full JSON as a single line). Do not commit `.env` or any credential files.
- **CORS:** Backend allows all origins; tighten in production if needed.

## License

Private / TartanHacks project.
