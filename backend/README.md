# IN-SILK YATRA DMC Backend API

Laravel REST API backend for the travel agency application.

## Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Generate JWT secret:
```bash
php artisan jwt:secret
```

5. Configure database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=insilk_yatra
DB_USERNAME=root
DB_PASSWORD=your_password
```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed database (optional):
```bash
php artisan db:seed
```

8. Start development server:
```bash
php artisan serve
```

## API Endpoints

### Public Endpoints

- `GET /api/destinations` - List all destinations
- `GET /api/destinations/{id}` - Get destination details
- `GET /api/tours` - List all tours (supports `?destination_id=X&featured=true`)
- `GET /api/tours/{id}` - Get tour details
- `GET /api/testimonials` - List all testimonials
- `POST /api/leads` - Create a lead/inquiry

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Protected User Endpoints

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add tour to wishlist
- `DELETE /api/wishlist/{tourId}` - Remove tour from wishlist

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/dashboard` - Dashboard statistics

**Tours Management:**
- `GET /api/admin/tours` - List all tours
- `POST /api/admin/tours` - Create tour
- `GET /api/admin/tours/{id}` - Get tour
- `PUT /api/admin/tours/{id}` - Update tour
- `DELETE /api/admin/tours/{id}` - Delete tour

**Destinations Management:**
- `GET /api/admin/destinations` - List all destinations
- `POST /api/admin/destinations` - Create destination
- `GET /api/admin/destinations/{id}` - Get destination
- `PUT /api/admin/destinations/{id}` - Update destination
- `DELETE /api/admin/destinations/{id}` - Delete destination

**Testimonials Management:**
- `GET /api/admin/testimonials` - List all testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/{id}` - Update testimonial
- `DELETE /api/admin/testimonials/{id}` - Delete testimonial

**Leads Management:**
- `GET /api/admin/leads` - List all leads
- `GET /api/admin/leads/{id}` - Get lead details
- `PATCH /api/admin/leads/{id}` - Update lead status

## Authentication

### User Authentication (JWT)
- Register/Login returns a JWT token
- Include token in Authorization header: `Bearer {token}`
- Token expires after 60 minutes (configurable)

### Admin Authentication (Sanctum)
- Login returns a Sanctum token
- Include token in Authorization header: `Bearer {token}`

## Default Admin Credentials

After seeding:
- Email: `admin@insilkyatra.com`
- Password: `password`

**⚠️ Change these credentials in production!**

## Database Structure

- `users` - Regular users
- `admins` - Admin users
- `roles` - User/admin roles
- `destinations` - Travel destinations
- `tours` - Tour packages
- `testimonials` - Customer testimonials
- `wishlists` - User wishlists
- `leads` - Contact form inquiries

## CORS Configuration

CORS is configured to allow requests from the frontend. Update `config/cors.php` for production domains.
