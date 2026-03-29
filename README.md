# TransEase

A full-stack bus ticket booking application built with React and Node.js. TransEase lets passengers search routes, select seats interactively, enter passenger details, and receive a confirmed booking — all through a single, cohesive flow.

---

## Features

- Search buses by departure city, arrival city, and travel date
- View route details including stops, timings, AC status, and seat types
- Interactive seat map with Normal, Semi-Sleeper, and Sleeper categories
- Per-passenger detail collection (name, age, gender)
- Booking confirmation with a unique booking ID and full trip summary
- Responsive dark-mode UI with glassmorphism design

---

## Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations and transitions |
| React Router v7 | Client-side routing |
| Axios | HTTP client |

### Backend (`/server`)

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database and ODM |
| UUID | Unique booking ID generation |
| Nodemon + ts-node | Dev hot-reloading |

---

## Project Structure

```
TransEase/
├── client/
│   └── src/
│       ├── api/               # Axios API calls
│       ├── components/        # Reusable UI components
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── BusList.tsx
│       │   ├── SeatSelection.tsx
│       │   └── BookingConfirm.tsx
│       └── types/
│
└── server/
    └── src/
        ├── config/            # Database connection
        ├── controllers/       # Route handlers
        ├── middleware/        # Error handler
        ├── models/
        │   ├── Bus.ts
        │   └── Booking.ts
        ├── routes/
        │   ├── buses.ts
        │   └── bookings.ts
        └── seed/              # Database seeding script
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (Atlas cluster or local instance)

### 1. Clone the repository

```bash
git clone https://github.com/sharmishta173/TransEase.git
cd TransEase
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed the database

```bash
cd server
npm run seed
```

### 5. Start development servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## API Reference

### Buses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/buses` | List buses (supports query filters) |
| `GET` | `/api/buses/:id` | Get a single bus by ID |

**Search query parameters:**

```
GET /api/buses?departureCity=Mumbai&arrivalCity=Pune&date=2026-03-30
```

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/:id` | Get booking details |

**POST `/api/bookings` body:**

```json
{
  "busId": "ObjectId",
  "seats": [3, 7],
  "passengerDetails": [
    { "name": "Alice", "age": 28, "gender": "female" },
    { "name": "Bob", "age": 32, "gender": "male" }
  ],
  "totalPrice": 1200
}
```

---

## Scripts

### Server

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed` | Seed MongoDB with sample bus data |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## License

ISC
