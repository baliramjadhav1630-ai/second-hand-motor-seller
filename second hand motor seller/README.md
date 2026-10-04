# MotorVault — 3D Second-Hand Motor Marketplace

A complete, production-quality, local full-stack web application for buying and selling premium pre-owned and collector motor vehicles. Features an interactive 3D WebGL showroom with Three.js, realistic 150-point condition telemetry, multi-facet marketplace filters, a 5-step vehicle listing wizard with local photo upload, seller dashboard, and inquiries/offers management.

---

## 🏎️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **3D Engine**: Three.js + `@react-three/fiber` + `@react-three/drei` (with high-detail procedural automotive geometry & materials, realistic clearcoat paint, and WebGL fallbacks)
- **Icons**: Lucide React
- **Backend API**: Node.js + Express + TypeScript
- **Database**: SQLite with persistent WebAssembly zero-friction storage (`server/motorvault.db`)
- **Image Storage**: Local disk storage via Multer in `server/uploads/`
- **Authentication**: Local demo JWT authentication with 1-click accounts

---

## ⚡ Prerequisites

- **Node.js**: v18+ (tested and running on Node v24)
- **npm**: v9+

---

## 🚀 Quick Start (One Command)

From the project root directory:

```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Seed realistic demo vehicles and accounts into SQLite
npm run seed

# 3. Start both backend and frontend concurrently
npm run dev
```

The application will be live at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **API Health**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔑 Demo Login Accounts

You can sign in with 1-click using the buttons on the Login page (`/login`), or enter:

| Role | Email | Password | Details |
|---|---|---|---|
| **Demo Seller** | `demo@motorvault.com` | `password123` | Alex Mercer (Verified Ambassador) |
| **Demo Buyer** | `buyer@motorvault.com` | `password123` | Jordan Vance (Active Buyer) |
| **Certified Partner** | `certified@motorvault.com` | `password123` | MotorVault Certified Dealership |

---

## 🧭 Pages & Routes

- `/` — **3D Hero Showroom**: Full-screen 3D vehicle turntable, vehicle switcher, camera presets (Front, Side, Rear, Iso, Cockpit), interactive 3D data-driven hotspots, and quick search overlay.
- `/buy` — **Marketplace**: Multi-facet reactive filters (make, model, price slider, year, mileage, fuel, transmission, body type, certified), sorting options, search, grid/list view toggle, and persisted favorites.
- `/vehicle/:id` — **Vehicle Detail**: Split layout with 3D viewer / photo gallery toggle, 150-point inspection audit gauges, technical specifications, service history timeline, financing calculator slider, and "Request Test Drive" & "Make an Offer" modals.
- `/sell` — **Sell Your Vehicle**: 5-step wizard (Vehicle details → Local photo upload & preview → Condition checklist → Pricing & description → Live review mockup → Publish to SQLite).
- `/dashboard` — **Seller Dashboard**: Real-time stats (Active listings, views, favorites, inquiries), listing pause/resume toggle, quick edit price modal, delete listing, and incoming offers/test drive inbox with Accept/Decline status updates.
- `/about` — **About & Trust**: Brand philosophy, 150-point digital inspection standards, and FAQ accordion.
- `/login` — **Local Demo Auth**: One-click demo sign-in and account registration.

---

## 🛠️ API Reference

- `GET /api/vehicles` — List, search, filter, and sort vehicle listings
- `GET /api/vehicles/:id` — Full details including images, specs, hotspots, and service records
- `POST /api/vehicles` — Create new vehicle listing
- `PUT /api/vehicles/:id` — Edit listing (price, status, description)
- `DELETE /api/vehicles/:id` — Delete listing
- `GET /api/favorites` & `POST /api/favorites` & `DELETE /api/favorites/:id` — Favorite actions
- `GET /api/inquiries` & `POST /api/inquiries` & `PATCH /api/inquiries/:id/status` — Test drive requests, price offers, and questions
- `POST /api/upload` — Local image upload (stored in `server/uploads/`)
- `GET /api/dashboard/stats` — Seller summary metrics
- `POST /api/auth/login` & `POST /api/auth/register` & `GET /api/auth/me` — Local authentication

---

## 📦 Production Build

```bash
# Build both server and client
npm run build

# Start production server
npm start
```

---

## 🔧 Troubleshooting

1. **Port 5001 or 5173 already in use**:
   Change `PORT=5002` in `.env` or pass `PORT=5002 npm run dev:server`.
2. **Missing SQLite Data**:
   Run `npm run seed` to re-seed the 12 vehicles and demo inquiries.
3. **WebGL Disabled**:
   If WebGL is unavailable on your system, the app automatically displays high-definition 2D gallery fallbacks while maintaining all interactive filters and buying/selling workflows.
