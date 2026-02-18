# 🚀 Hostinger Deployment Guide - IN-SILK YATRA DMC

## Step-by-Step Deployment Process

### Phase 1: Prepare Files for Upload ✅

#### 1.1 Build Frontend (Next.js)
```bash
cd frontend
npm install
npm run build
```

This creates optimized production files.

#### 1.2 Prepare Backend (Laravel)
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**IMPORTANT FILES TO EXCLUDE FROM UPLOAD:**
- `node_modules/` (in both frontend and backend)
- `.git/`
- `tests/`
- `.env` (will create fresh on server)
- `storage/logs/*.log`

### Phase 2: Hostinger Setup 🌐

#### 2.1 Create MySQL Database
1. Login to Hostinger hPanel
2. Go to **MySQL Databases**
3. Click **Create Database**
4. Note down:
   - Database Name: `u123456789_insilk`
   - Database User: `u123456789_insilk_user`
   - Database Password: (your chosen password)
   - Database Host: Usually `localhost` or `127.0.0.1`

#### 2.2 Setup Domain/Subdomain Structure

**Recommended Structure:**
- Main domain: `yourdomain.com` → Frontend (public_html/)
- Subdomain: `api.yourdomain.com` → Backend (public_html/api/)

**Steps:**
1. Go to **Domains** → **Subdomains**
2. Create subdomain: `api`
3. Point to folder: `public_html/api/public`

### Phase 3: Upload Files 📤

#### 3.1 Upload Frontend
**Method 1: File Manager**
1. Open **File Manager** in hPanel
2. Go to `public_html/`
3. Delete default `index.html` if present
4. Upload ALL files from `frontend/.next/` **BUT** configure properly first (see below)

**Method 2: FTP/SFTP (Recommended for large files)**
1. Use FileZilla or WinSCP
2. Connect using credentials from hPanel
3. Upload to `public_html/`

#### 3.2 Upload Backend
1. Create folder `public_html/api/`
2. Upload entire `backend/` folder contents to `public_html/api/`
3. Ensure `public_html/api/public/` contains `index.php`

### Phase 4: Configure Backend 🔧

#### 4.1 Create .env File
1. Go to `public_html/api/` in File Manager
2. Create new file `.env`
3. Copy contents from `.env.example`
4. Update with production values:

```env
APP_NAME="IN-SILK YATRA DMC"
APP_ENV=production
APP_KEY=base64:LzuV8aPp9p2Ttd1jg7wlkWo7qE8wCl3Gm7zhq3F94so=
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_insilk
DB_USERNAME=u123456789_insilk_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_here

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Cloudinary (if using image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4.2 Generate Application Keys
Using **Terminal/SSH** (if available) or use online tool:
```bash
ssh your-username@your-server
cd public_html/api
php artisan key:generate
php artisan jwt:secret
```

**If SSH not available:** Use the existing APP_KEY and generate JWT_SECRET manually.

#### 4.3 Set File Permissions
```bash
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs
```

Or via File Manager: Right-click → Change Permissions → 755 for folders, 644 for files.

#### 4.4 Run Database Migrations
```bash
cd public_html/api
php artisan migrate --force
php artisan db:seed --force
```

**If no SSH access:** Use phpMyAdmin to import SQL manually:
1. Export from local: `php artisan migrate --pretend > migration.sql`
2. Import via phpMyAdmin

### Phase 5: Configure Frontend 🎨

#### 5.1 Set API URL
Before building, update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

#### 5.2 Rebuild Frontend
```bash
cd frontend
npm run build
```

#### 5.3 Upload Built Files
Upload contents of `frontend/out/` or `frontend/.next/` to `public_html/`

### Phase 6: Setup .htaccess Files 📝

#### 6.1 Frontend .htaccess (public_html/.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle trailing slashes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /$1/ [L,R=301]
  
  # Serve index.html for all routes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

#### 6.2 Backend .htaccess (public_html/api/.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### 6.3 Laravel Public .htaccess (already exists)
File: `public_html/api/public/.htaccess`
(Should be automatically present from Laravel)

### Phase 7: Enable SSL Certificate 🔒

1. Go to **SSL** section in hPanel
2. Enable free **Let's Encrypt SSL** for your domain
3. Force HTTPS:

Add to top of `public_html/.htaccess`:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Phase 8: Testing ✅

#### 8.1 Test Backend API
Visit: `https://api.yourdomain.com/api/health` or `/api/tours`

Expected: JSON response

#### 8.2 Test Frontend
Visit: `https://yourdomain.com`

Expected: Homepage loads

#### 8.3 Test Features
- [ ] User registration
- [ ] User login
- [ ] View tours/destinations
- [ ] Admin login
- [ ] Contact form
- [ ] WhatsApp links

### Phase 9: Post-Deployment Configuration ⚙️

#### 9.1 Update CORS Settings
File: `backend/config/cors.php`
```php
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
],
```

Then clear cache:
```bash
php artisan config:cache
```

#### 9.2 Change Default Admin Password
1. Login to admin panel
2. Go to profile settings
3. Change password immediately

#### 9.3 Setup Email (Optional but Recommended)
Update in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="IN-SILK YATRA DMC"
```

## 🚨 Troubleshooting Common Issues

### Error: 500 Internal Server Error
**Solutions:**
1. Check `storage/logs/laravel.log`
2. Verify `.env` file exists and is correct
3. Run: `php artisan config:clear`
4. Check file permissions: 755 for folders, 644 for files

### Error: CORS Policy Error
**Solutions:**
1. Update `config/cors.php` with your domain
2. Run: `php artisan config:cache`
3. Check frontend is using correct API URL

### Error: Database Connection Failed
**Solutions:**
1. Verify database credentials in `.env`
2. Check database host (try both `localhost` and `127.0.0.1`)
3. Ensure database user has all privileges

### Frontend Not Loading Data
**Solutions:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Test API endpoint directly in browser
4. Check CORS settings

### Images Not Loading
**Solutions:**
1. Verify Cloudinary credentials in `.env`
2. Check `storage/` permissions
3. Ensure `public/uploads/` is writable

## 📋 Pre-Deployment Checklist

- [ ] Frontend built with production API URL
- [ ] Backend `.env` configured for production
- [ ] Database created on Hostinger
- [ ] All files uploaded (except node_modules, .git)
- [ ] File permissions set correctly
- [ ] Database migrations run
- [ ] SSL certificate enabled
- [ ] .htaccess files in place
- [ ] CORS configured for production domain
- [ ] Admin credentials changed
- [ ] Email configured (optional)
- [ ] All features tested

## 🔄 Future Updates

To update the application:

1. Make changes locally
2. Test thoroughly
3. Build frontend: `npm run build`
4. Upload changed files only
5. Run migrations if needed: `php artisan migrate`
6. Clear caches: `php artisan cache:clear`

## 📞 Important Notes

1. **Backup Before Deployment:** Always backup database before major updates
2. **Keep Local Copy:** Maintain a local development environment
3. **Monitor Logs:** Regularly check `storage/logs/laravel.log`
4. **Security:** Never commit `.env` file to Git
5. **Performance:** Use caching for better performance

---

**Your Domain URLs After Deployment:**
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com/api
- Admin Panel: https://yourdomain.com/admin

Good luck with your deployment! 🚀
