# QuickGrocery PWA — Full Stack Implementation

A modern Progressive Web App for quick grocery delivery built with **React 18 + Vite** (frontend) and **NestJS** (backend), with real-time order tracking via Server-Sent Events.

## 🏗 Architecture

```
├── frontend/          React 18 + Vite + PWA (Workbox)
├── backend/           NestJS modular monolith
├── docker-compose.yml PostgreSQL + MongoDB + Redis
└── .env               Configuration
```

### Databases
- **PostgreSQL**: User auth, orders, addresses (TypeORM)
- **MongoDB**: Product catalog with full-text search (Mongoose)

### Features (MVP)
- ✅ User authentication (JWT + refresh tokens)
- ✅ Product catalog with search & filtering
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout with delivery address
- ✅ Order history
- ✅ Real-time order tracking (SSE)
- ✅ PWA with offline support

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Docker & Docker Compose**
- **npm**

### 1. Start Databases

```bash
docker-compose up -d
```

Verify all services are running:
```bash
docker-compose ps
```

### 2. Seed Data

```bash
cd backend
npm run seed
```

This populates MongoDB with 8 categories and 12+ products.

### 3. Run Backend

```bash
cd backend
npm install  # if not already done
npm run start:dev
```

Backend boots on `http://localhost:3000/api`

### 4. Run Frontend

In a new terminal:

```bash
cd frontend
npm install  # if not already done
npm run dev
```

Frontend boots on `http://localhost:5173`

### 5. Test the App

1. **Register**: Go to http://localhost:5173/auth/register
2. **Browse products**: Home page loads categories from MongoDB
3. **Add to cart**: Products stored in localStorage
4. **Checkout**: Create an order (requires address)
5. **Track order**: View real-time status updates via SSE

---

## 📁 Project Structure

### Backend (`/backend`)

```
src/
├── config/             Configuration factory
├── database/           TypeORM + Mongoose setup
├── auth/               JWT, login, register
├── users/              Profile & addresses
├── products/           MongoDB product catalog
├── cart/               Shopping cart (PostgreSQL)
├── orders/             Order lifecycle
├── notifications/      SSE order tracking
└── main.ts             Entry point
```

**Key Routes:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

GET    /api/users/profile
GET    /api/users/addresses
POST   /api/users/addresses
PATCH  /api/users/addresses/:id
DELETE /api/users/addresses/:id

GET    /api/products?page&limit&search&category
GET    /api/products/:slug
GET    /api/products/categories

GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/orders/:id/events (SSE)
```

### Frontend (`/frontend`)

```
src/
├── lib/                API client, query client config
├── stores/             Zustand (auth, cart, UI)
├── hooks/              React Query hooks
├── components/
│   └── layout/         AppShell, ProtectedRoute
├── pages/              Route components
└── App.tsx             Router setup
```

**Pages:**
- `/` — Home with categories
- `/products` — Product listing
- `/products/:slug` — Product detail
- `/cart` — Shopping cart
- `/checkout` — Checkout (protected)
- `/orders` — Order history (protected)
- `/orders/:id` — Order tracking with real-time SSE (protected)
- `/auth/login`, `/auth/register` — Authentication

---

## 🔐 Authentication Flow

1. **Register/Login**: Username & password hashed with bcrypt
2. **Access Token**: 15-min JWT, stored in-memory (Zustand)
3. **Refresh Token**: 7-day JWT, stored as `httpOnly` cookie
4. **Auto-Refresh**: On 401, frontend calls `/auth/refresh`, rotates tokens, retries
5. **Protected Routes**: `<ProtectedRoute>` guards pages

---

## 📦 State Management

### **Zustand** (Client State)
- `authStore`: user, accessToken
- `cartStore`: items (persisted to localStorage)
- `uiStore`: search, mobile menu

### **React Query** (Server State)
- `useProducts()` — Product listing
- `useProduct(slug)` — Single product
- `useOrders()` — Order history
- `useOrder(id)` — Single order with status history
- `useOrderTracking(id)` — SSE hook for live updates

---

## 🌐 PWA & Offline

- **Manifest**: Installed as standalone app
- **Service Worker** (Workbox): Pre-caches static assets
- **Caching Strategy**:
  - `NetworkFirst` for API calls
  - `CacheFirst` for images
  - `StaleWhileRevalidate` for product listings
- **Offline**: Cached products & cart work offline; checkout requires network

---

## 🛒 Cart & Checkout Flow

1. Add product to cart → stored in localStorage + Zustand
2. View cart → displays items with price snapshot
3. Checkout → select saved address → creates order
4. Order created → cart cleared, user redirected to tracking page

---

## 🚚 Real-Time Order Tracking

Backend uses **NestJS EventEmitter2** to broadcast order status updates:

```
SSE Stream: GET /api/orders/:id/events
Events: placed → preparing → out_for_delivery → delivered

Frontend: useOrderTracking(orderId) opens EventSource
```

**To test:**
```bash
# Admin: Update order status
curl -X PATCH http://localhost:3000/api/admin/orders/:id/status \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'

# Frontend: SSE connection auto-receives new event
```

---

## 🧪 Testing API

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }' | jq '.accessToken'
```

### Get Products

```bash
curl "http://localhost:3000/api/products?search=banana&limit=10"
```

### Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"addressId": "<ADDRESS_ID>"}'
```

---

## 📝 Environment Variables

See `.env.example` for all options. Key variables:

```bash
# Backend
PORT=3000
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...
JWT_SECRET=<generate_random_string>
JWT_REFRESH_SECRET=<generate_random_string>
COOKIE_SECRET=<generate_random_string>

# Frontend
VITE_API_URL=/api  (proxied by dev server)
```

---

## 🏗 Build for Production

### Backend

```bash
cd backend
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm run build
npx vite preview
```

PWA ready for deployment!

---

## 🐛 Troubleshooting

### Databases won't start
```bash
docker-compose down -v
docker-compose up -d
```

### API not reachable
- Check backend is running: `curl http://localhost:3000/api/products`
- Check CORS config in `backend/src/main.ts`

### Frontend can't login
- Verify refresh token cookie is being set: DevTools → Application → Cookies
- Check JWT_SECRET is set in `.env`

### Seed data not appearing
```bash
cd backend
npm run seed
```

---

## 📚 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, Zustand, React Query |
| Backend | NestJS, Express, Passport.js, JWT |
| Database | PostgreSQL (auth/orders), MongoDB (products) |
| Real-time | Server-Sent Events (SSE) |
| PWA | Workbox, vite-plugin-pwa |
| Styling | Tailwind CSS |
| Validation | class-validator, Zod |

---

## 🚀 Next Steps

- Add payment integration (Stripe)
- Admin dashboard for order management
- Email notifications
- Mobile app (React Native)
- Geolocation-based delivery estimates
- Product recommendations engine
- User reviews & ratings

---

## 📄 License

MIT

---

**Built with ❤️ using NestJS + React + Vite**
