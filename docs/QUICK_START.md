# Quick Start Guide - IN-SILK YATRA DMC

## Prerequisites

- PHP 8.1+ with Composer
- Node.js 18+ with npm
- MySQL 5.7+ or 8.0+
- Git

## Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database in .env file
# Edit .env and set:
# DB_DATABASE=insilk_yatra
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database (optional - creates sample data)
php artisan db:seed

# Start development server
php artisan serve
```

Backend will run at: `http://localhost:8000`

## Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:3000`

## Step 3: Test the Application

1. **Visit Frontend**: Open `http://localhost:3000`
2. **Register a User**: Go to `/register` and create an account
3. **Browse Tours**: Visit `/tours` to see available tours
4. **Add to Wishlist**: Click "Add to Wishlist" on any tour (requires login)
5. **View Dashboard**: Visit `/dashboard` to see your wishlist

## Default Admin Credentials

After running `php artisan db:seed`:

- **Email**: `admin@insilkyatra.com`
- **Password**: `password`

⚠️ **Change these in production!**

## Admin Panel Access

Admin panel is accessed via API endpoints. You can use:
- Postman
- Insomnia
- Custom admin frontend (not included)

### Admin Login Example (cURL)

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@insilkyatra.com",
    "password": "password"
  }'
```

Response includes a token. Use this token for subsequent admin API calls.

## Common Issues

### Backend Issues

**Error: JWT secret not set**
```bash
php artisan jwt:secret
```

**Error: Database connection failed**
- Check `.env` database credentials
- Ensure MySQL is running
- Verify database exists

**Error: Class not found**
```bash
composer dump-autoload
```

### Frontend Issues

**Error: API calls failing**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

1. **Backend Logs**: Check `backend/storage/logs/laravel.log`
2. **Frontend Logs**: Check browser console
3. **API Testing**: Use Postman or browser DevTools Network tab
4. **Database**: Use phpMyAdmin or MySQL CLI to inspect data

## Next Steps

1. Customize tours and destinations via admin API
2. Update WhatsApp numbers in components
3. Add real images for tours/destinations
4. Configure production environment variables
5. Deploy to hosting (see DEPLOYMENT.md)

## Project Structure

- `frontend/` - Next.js application
- `backend/` - Laravel API
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_STRUCTURE.md` - Detailed structure

## Support

For issues:
1. Check logs (backend: `storage/logs/`, frontend: browser console)
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database connection
