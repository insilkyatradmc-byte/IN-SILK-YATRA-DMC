# IN-SILK YATRA DMC - Travel Agency Web Application

A full-scale, production-ready travel agency web application for luxury Destination Management Company operating in Kazakhstan, Kyrgyzstan, and Azerbaijan.

## Architecture

- **Frontend**: Next.js (App Router) with Static/Hybrid mode
- **Backend**: Laravel PHP REST API
- **Database**: MySQL
- **Authentication**: JWT-based
- **Hosting**: Shared hosting (Hostinger Business plan)

## Project Structure

```
In-Silk_Yatra/
├── frontend/          # Next.js application
├── backend/           # Laravel API
└── README.md
```

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Development
npm run build        # Production build (static export)
```

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan jwt:secret
```

### Database Setup
1. Create MySQL database via hosting control panel
2. Update `.env` file in backend with database credentials
3. Run migrations: `php artisan migrate`

## Features

- Public website with destinations and tours
- User authentication (JWT)
- Wishlist functionality
- User dashboard
- Admin panel with CRUD operations
- Role-based access control
- Leads management
- WhatsApp integration

## User Roles

1. **Guest**: Public access
2. **Authenticated User**: Can add to wishlist, view dashboard
3. **Admin**: Full access to admin panel
4. **Sub-admin**: Limited permissions

## API Endpoints

See `backend/README.md` for complete API documentation.

## Deployment

### Frontend
- Build: `npm run build`
- Deploy `out/` folder to `public_html/`

### Backend
- Deploy Laravel to `/api` subdirectory or subdomain
- Configure `.env` for production
- Set proper file permissions
