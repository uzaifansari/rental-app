# Celeb MVP — Community Fashion Rental

A peer-to-peer clothing & accessories rental app (local meetup model).

---

## Project Structure

```
celeb-mvp/
├── backend/    → Node.js + Express + MongoDB API
└── frontend/   → React + Vite + Redux + CSS
```

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # Fill in your values
npm run dev             # Runs on http://localhost:5000
```

**.env values needed:**
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — any random secret string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from cloudinary.com

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # Runs on http://localhost:3000
```

---

## API Reference

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/me | Private |

### Listings
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/listings | Public |
| GET | /api/listings/:id | Public |
| GET | /api/listings/my | Private |
| POST | /api/listings | Private |
| PUT | /api/listings/:id | Private (owner) |
| DELETE | /api/listings/:id | Private (owner) |

### Rentals
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/rentals | Private (renter) |
| GET | /api/rentals/my | Private (renter) |
| GET | /api/rentals/incoming | Private (lender) |
| PUT | /api/rentals/:id/accept | Private (lender) |
| PUT | /api/rentals/:id/cancel | Private (both) |
| PUT | /api/rentals/:id/complete | Private (lender) |

---

## Pages

| Page | Route | Who |
|------|-------|-----|
| Browse Listings | `/` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Listing Detail | `/listings/:id` | Public |
| Create Listing | `/create-listing` | Auth only |
| Dashboard | `/dashboard` | Auth only |

---

## Features

- ✅ JWT Authentication (signup/login/session restore)
- ✅ Create, browse, and view listings
- ✅ Image upload via Cloudinary
- ✅ Rental request flow with date picker + meetup location
- ✅ Lender accepts/declines/completes rentals
- ✅ Renter can cancel pending requests
- ✅ Listing availability auto-updates on accept/complete/cancel
- ✅ Dashboard with tabs: My Listings / My Rentals / Incoming Requests
- ✅ Redux for global state (no unnecessary re-fetches on reload)
- ✅ Filter & search listings by category, size, city, keyword

---

## Next Steps (Post-MVP)

- [ ] Reviews & ratings after rental completion
- [ ] In-app notifications (socket.io or polling)
- [ ] Edit listing page
- [ ] User public profiles
- [ ] Payment integration (Razorpay for India)
- [ ] Admin panel
