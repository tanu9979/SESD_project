# Folio — Old Books Buy, Sell & Rent Platform

A peer-to-peer marketplace where users can buy, sell, rent, or donate second-hand books. Built with Node.js, Express, MongoDB and React 18.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| OOP Patterns | Inheritance, Singleton, Factory, Strategy, Observer |

---

## Features

- Register & login with auto country/currency detection
- Browse, search and filter books by category, condition, type and exam tag
- Buy, rent, or request a donated book
- Full order lifecycle: Cart → Payment → Processing → Shipped → Delivered
- Pincode-based delivery date estimate
- Real-time chat between buyer and seller (Socket.io)
- Seller ratings and reviews
- Seller insights and donor notes on each listing
- India-specific competitive exam tag filter (NEET, JEE, UPSC, GATE, etc.)
- Live currency conversion via frankfurter.app
- Admin panel: manage users, listings, transactions and feedback

---

## Architecture

```
Controller → Service → Repository → Database
```

| Pattern | Applied Where |
|---|---|
| Inheritance | BaseRepository → 10 domain repositories |
| Singleton | MongoDB connection pool (db.ts) |
| Factory | ApiResponse.success() / .error() |
| Strategy | BookRepository.buildFilter() — dynamic WHERE builder |
| Observer | Socket.io — chat events broadcast to room |

---

## Project Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5001
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Seed the database:

```bash
npx ts-node src/scripts/seed.ts
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Test Credentials

### Admin
| Email | Password |
|---|---|
| admin@folio.in | Admin@123 |

### Buyers / Sellers (any of these)
| Name | Email | Password |
|---|---|---|
| Rahul Sharma | rahul@example.in | Pass@1234 |
| Priya Verma | priya@example.in | Pass@1234 |
| Arjun Mehta | arjun@example.in | Pass@1234 |
| Sneha Iyer | sneha@example.in | Pass@1234 |
| Vikram Patel | vikram@example.in | Pass@1234 |
| Ananya Roy | ananya@example.in | Pass@1234 |
| Karan Singh | karan@example.in | Pass@1234 |
| Meera Nair | meera@example.in | Pass@1234 |
| Rohan Gupta | rohan@example.in | Pass@1234 |

---

## API Endpoints (Key)

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/books | Public |
| POST | /api/books | Auth |
| POST | /api/orders | Auth |
| GET | /api/orders/my | Auth |
| POST | /api/payments/initiate | Auth |
| POST | /api/rentals | Auth |
| GET | /api/chat/conversations | Auth |
| GET | /api/admin/users | Admin |

---

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| join_conversation | Client → Server | Join a chat room |
| send_message | Client → Server | Send a message |
| receive_message | Server → Client | Broadcast to room |
| message_read | Client → Server | Mark message as read |
