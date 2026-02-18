# Deployment Guide - IN-SILK YATRA DMC

This guide covers deploying the application to shared hosting (Hostinger Business plan).

## Prerequisites

- Hostinger Business hosting account
- Access to cPanel
- MySQL database created
- PHP 8.1+ enabled
- Node.js access (for building frontend)

## Frontend Deployment (Next.js)

### 1. Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a static export in the `frontend/out/` directory.

### 2. Upload to Hosting

1. Connect via FTP/SFTP or use cPanel File Manager
2. Upload all contents of `frontend/out/` to `public_html/`
3. Ensure `.htaccess` is configured for Next.js routing (if needed)

### 3. Configure API URL

Update `frontend/.env.production` or set environment variable:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Rebuild after changing:
```bash
npm run build
```

## Backend Deployment (Laravel)

### 1. Prepare Laravel for Production

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Upload Backend Files

Upload backend files to a subdirectory, e.g., `public_html/api/` or use a subdomain like `api.yourdomain.com`

**Important:** Do NOT upload:
- `node_modules/`
- `.git/`
- `tests/`
- `.env` (create it on server)

### 3. Configure Environment

1. Copy `.env.example` to `.env` on server
2. Update `.env` with production values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_here
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Generate JWT secret:
```bash
php artisan jwt:secret
```

### 4. Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 5. Run Migrations

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 6. Configure Web Server

#### Option A: Subdirectory (`/api`)

Create `.htaccess` in `public_html/api/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Point document root to `public_html/api/public/`

#### Option B: Subdomain (`api.yourdomain.com`)

Point subdomain to `public_html/api/public/`

### 7. Update Frontend API URL

Update `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Or if using subdomain:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Database Setup

1. Create MySQL database via cPanel
2. Create database user
3. Grant privileges
4. Update `.env` with credentials
5. Run migrations

## Security Checklist

- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong database passwords
- [ ] Generate secure `APP_KEY` and `JWT_SECRET`
- [ ] Enable HTTPS/SSL certificate
- [ ] Update admin credentials (change default password)
- [ ] Configure CORS for your domain only
- [ ] Set proper file permissions
- [ ] Enable firewall rules if available

## Post-Deployment

1. Test all API endpoints
2. Test user registration/login
3. Test wishlist functionality
4. Test admin panel access
5. Test contact form submissions
6. Verify WhatsApp links work
7. Check mobile responsiveness
8. Test SEO meta tags

## Troubleshooting

### 500 Error
- Check `.env` configuration
- Verify file permissions
- Check Laravel logs: `storage/logs/laravel.log`

### CORS Issues
- Update `config/cors.php` with production domain
- Clear config cache: `php artisan config:clear`

### Database Connection Error
- Verify database credentials in `.env`
- Check database host (may be `localhost` or specific host)
- Ensure database user has proper permissions

### Frontend Not Loading API Data
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for CORS errors
- Verify backend is accessible

## Maintenance

### Clear Caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Update Application
1. Upload new files
2. Run migrations: `php artisan migrate`
3. Clear caches
4. Rebuild frontend if needed

## Support

For issues, check:
- Laravel logs: `storage/logs/laravel.log`
- Server error logs (cPanel)
- Browser console (frontend errors)
