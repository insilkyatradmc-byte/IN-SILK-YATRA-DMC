# Project Structure - IN-SILK YATRA DMC

## Overview

This is a full-stack travel agency web application with:
- **Frontend**: Next.js (Static/Hybrid mode)
- **Backend**: Laravel PHP REST API
- **Database**: MySQL

## Directory Structure

```
In-Silk_Yatra/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                  # Next.js App Router
│   │   ├── about/           # About Us page
│   │   ├── contact/         # Contact page
│   │   ├── dashboard/       # User dashboard (protected)
│   │   ├── destinations/    # Destinations listing & detail
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── tours/           # Tours listing & detail
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── auth/           # Auth-related components
│   │   ├── home/           # Homepage components
│   │   └── layout/         # Layout components
│   ├── lib/                # Utilities & API clients
│   │   ├── api.ts          # API client (Axios)
│   │   └── auth.ts         # Auth utilities
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies
│   ├── next.config.js      # Next.js configuration
│   └── tailwind.config.js  # Tailwind CSS config
│
├── backend/                 # Laravel Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── Api/    # Public API controllers
│   │   │       └── Admin/  # Admin panel controllers
│   │   └── Models/         # Eloquent models
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   ├── routes/
│   │   ├── api.php        # Public API routes
│   │   └── admin.php      # Admin API routes
│   ├── config/            # Configuration files
│   └── composer.json      # PHP dependencies
│
├── README.md              # Main project README
├── DEPLOYMENT.md          # Deployment guide
└── PROJECT_STRUCTURE.md   # This file
```

## Frontend Structure

### Pages (App Router)
- `/` - Homepage with hero, featured tours, testimonials
- `/destinations` - List all destinations
- `/destinations/[slug]` - Destination detail page
- `/tours` - List all tours
- `/tours/[slug]` - Tour detail page
- `/about` - About Us page
- `/contact` - Contact form page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard (protected)

### Components
- `Navbar` - Navigation bar with auth state
- `Footer` - Site footer
- `Hero` - Homepage hero section
- `FeaturedTours` - Featured tours carousel
- `WhyChooseUs` - Features section
- `Testimonials` - Customer testimonials
- `WhatsAppCTA` - WhatsApp call-to-action
- `ProtectedRoute` - Route protection wrapper

### API Integration
- `lib/api.ts` - Axios instance with interceptors
- `lib/auth.ts` - Authentication utilities
- All API calls use the centralized API client

## Backend Structure

### API Endpoints

#### Public Endpoints (`/api/*`)
- `GET /api/destinations` - List destinations
- `GET /api/destinations/{id}` - Get destination
- `GET /api/tours` - List tours (with filters)
- `GET /api/tours/slug/{slug}` - Get tour by slug
- `GET /api/tours/{id}` - Get tour by ID
- `GET /api/testimonials` - List testimonials
- `POST /api/leads` - Create lead/inquiry
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

#### Protected User Endpoints (`/api/*` with JWT)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/{tourId}` - Remove from wishlist

#### Admin Endpoints (`/api/admin/*` with Sanctum)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/dashboard` - Dashboard stats
- `GET|POST|PUT|DELETE /api/admin/tours` - Tours CRUD
- `GET|POST|PUT|DELETE /api/admin/destinations` - Destinations CRUD
- `GET|POST|PUT|DELETE /api/admin/testimonials` - Testimonials CRUD
- `GET|GET|PATCH /api/admin/leads` - Leads management

### Database Schema

#### Core Tables
- `users` - Regular users
- `admins` - Admin users
- `roles` - User/admin roles
- `destinations` - Travel destinations
- `tours` - Tour packages
- `testimonials` - Customer testimonials
- `wishlists` - User wishlists
- `leads` - Contact form inquiries

#### Relationships
- User → Wishlist (one-to-many)
- Destination → Tours (one-to-many)
- Tour → Wishlists (one-to-many)
- Tour → Testimonials (one-to-many)
- Tour → Leads (one-to-many)

## Authentication Flow

### User Authentication (JWT)
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in cookie
4. Token included in `Authorization: Bearer {token}` header
5. Protected routes check token validity

### Admin Authentication (Sanctum)
1. Admin logs in via `/api/admin/login`
2. Backend returns Sanctum token
3. Token stored and sent with requests
4. Admin routes protected by `auth:sanctum` middleware

## Wishlist Flow

1. User clicks "Add to Wishlist" on tour page
2. Frontend checks if user is authenticated
3. If not authenticated → redirect to login (store redirect URL)
4. If authenticated → POST to `/api/wishlist` with `tour_id`
5. Backend saves to `wishlists` table
6. Wishlist persists across sessions (stored in database)

## Admin Panel Flow

1. Admin logs in via admin panel
2. Can perform CRUD operations on:
   - Tours
   - Destinations
   - Testimonials
3. Can view and update lead status
4. Changes reflect immediately on frontend (via API)

## Key Features

### Frontend
- ✅ Static site generation (SSG)
- ✅ Client-side data fetching
- ✅ Protected routes
- ✅ JWT authentication
- ✅ Wishlist functionality
- ✅ Responsive design
- ✅ SEO optimized

### Backend
- ✅ RESTful API
- ✅ JWT authentication (users)
- ✅ Sanctum authentication (admins)
- ✅ Role-based access control
- ✅ CRUD operations
- ✅ Database relationships
- ✅ CORS configured

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (`.env`)
```
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=insilk_yatra
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret
JWT_TTL=60
```

## Development Workflow

1. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Build for Production**
   ```bash
   cd frontend
   npm run build
   # Output in frontend/out/
   ```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Notes

- Frontend is statically generated, no server-side rendering
- All dynamic data fetched client-side via API
- Backend is the single source of truth
- Admin panel changes reflect immediately on frontend
- Wishlist persists in database, not localStorage only
