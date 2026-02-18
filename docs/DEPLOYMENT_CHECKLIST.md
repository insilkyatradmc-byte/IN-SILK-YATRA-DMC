# 📋 Hostinger Deployment Checklist

Complete this checklist step by step. Tick ✅ each item as you complete it.

---

## 🔧 PRE-DEPLOYMENT (Local Machine)

### Files Preparation
- [ ] Run `deploy-preparation.bat` script
- [ ] Frontend built successfully (`npm run build`)
- [ ] Backend composer dependencies installed
- [ ] Updated `backend\.env.production` with database details
- [ ] Updated `frontend\.env.production` with API URL
- [ ] Deleted unnecessary files (.git, node_modules, tests)

### Configuration Files Ready
- [ ] `backend\.env.production` - Database & Cloudinary credentials filled
- [ ] `frontend\.htaccess.production` - Ready to upload
- [ ] `backend\.htaccess.production` - Ready to upload

### Credentials Prepared
- [ ] Hostinger hPanel login details ready
- [ ] FTP/SFTP credentials noted down
- [ ] Database password decided (strong password)
- [ ] Email credentials ready (if using SMTP)
- [ ] Cloudinary credentials ready

---

## 🌐 HOSTINGER SETUP

### Database Creation
- [ ] Logged into Hostinger hPanel
- [ ] Created MySQL database
- [ ] Noted database name: `__________________`
- [ ] Noted database user: `__________________`
- [ ] Noted database password: `__________________`
- [ ] Database host verified (usually `localhost`)

### Domain/Subdomain Setup
- [ ] Main domain verified: `__________________`
- [ ] Created subdomain: `api.yourdomain.com`
- [ ] Subdomain pointed to: `public_html/api/public`
- [ ] DNS propagation checked (may take 1-24 hours)

### SSL Certificate
- [ ] SSL certificate activated (Let's Encrypt)
- [ ] Force HTTPS enabled
- [ ] Verified HTTPS working on domain

---

## 📤 FILE UPLOAD

### Frontend Upload to `public_html/`
- [ ] Connected via FTP/File Manager
- [ ] Backed up existing files (if any)
- [ ] Deleted default `index.html`
- [ ] Uploaded all files from `frontend\.next\` or `frontend\out\`
- [ ] Uploaded `.htaccess` file (from `.htaccess.production`)
- [ ] Verified `index.html` exists in `public_html/`

### Backend Upload to `public_html/api/`
- [ ] Created `api` folder in `public_html/`
- [ ] Uploaded entire `backend/` folder contents
- [ ] Verified `public/` folder exists with `index.php`
- [ ] Uploaded `.htaccess` to `public_html/api/`
- [ ] Did NOT upload: node_modules, .git, tests, .env

---

## ⚙️ BACKEND CONFIGURATION

### Environment File (.env)
- [ ] Created `.env` file in `public_html/api/`
- [ ] Copied content from `.env.production`
- [ ] Updated `APP_URL` with your domain
- [ ] Updated `DB_DATABASE` with database name
- [ ] Updated `DB_USERNAME` with database user
- [ ] Updated `DB_PASSWORD` with database password
- [ ] Updated `CLOUDINARY_*` credentials
- [ ] Updated `MAIL_*` settings (if using email)
- [ ] Verified `JWT_SECRET` is set
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`

### File Permissions
- [ ] Set `storage/` permissions to 755 or 775
- [ ] Set `bootstrap/cache/` permissions to 755
- [ ] Set `storage/logs/` permissions to 775
- [ ] Verified web server can write to these folders

### Database Migration
- [ ] Accessed terminal/SSH (if available)
- [ ] Run: `cd public_html/api`
- [ ] Run: `php artisan migrate --force`
- [ ] Run: `php artisan db:seed --force`
- [ ] Verified tables created in phpMyAdmin

**If no SSH:**
- [ ] Used phpMyAdmin to import database schema manually

### Laravel Optimization
- [ ] Run: `php artisan config:cache`
- [ ] Run: `php artisan route:cache`
- [ ] Run: `php artisan view:cache`

**If no SSH:**
- [ ] Skipped caching (will auto-cache on first request)

---

## 🎨 FRONTEND CONFIGURATION

### API Connection
- [ ] Verified `NEXT_PUBLIC_API_URL` in frontend `.env.production`
- [ ] Frontend rebuilt with production API URL
- [ ] Uploaded updated files

### Routing
- [ ] `.htaccess` uploaded to `public_html/`
- [ ] Tested navigation between pages
- [ ] Verified dynamic routes work (/tours/[slug])

---

## ✅ TESTING

### Backend API Testing
- [ ] Visited: `https://api.yourdomain.com/api/tours`
- [ ] Got JSON response (not 404 or 500 error)
- [ ] Tested: `/api/destinations`
- [ ] Tested: `/api/testimonials`

### Frontend Testing
- [ ] Visited: `https://yourdomain.com`
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] Images loading (check browser console)
- [ ] No CORS errors in console

### Feature Testing
- [ ] User Registration works
- [ ] User Login works
- [ ] View Tours page works
- [ ] View Destinations page works
- [ ] Individual tour/destination pages work
- [ ] Contact form submits successfully
- [ ] WhatsApp links work correctly

### Admin Panel Testing
- [ ] Admin login page accessible: `/admin/login`
- [ ] Can login with admin credentials
- [ ] Admin dashboard loads
- [ ] Can view tours/destinations in admin
- [ ] Can create/edit content (if needed now)
- [ ] Changed default admin password

### Mobile Testing
- [ ] Tested on mobile device or emulator
- [ ] Responsive design working
- [ ] Touch navigation working

---

## 🔒 SECURITY CHECKS

### Laravel Security
- [ ] `APP_DEBUG=false` in production .env
- [ ] `APP_ENV=production` set
- [ ] `.env` file has correct permissions (644)
- [ ] Default admin password changed
- [ ] JWT secret is unique and secure

### CORS Configuration
- [ ] Updated `config/cors.php` with production domain
- [ ] Cleared config cache after CORS update
- [ ] Tested API calls from frontend (no CORS errors)

### File Security
- [ ] `.env` file not accessible via browser
- [ ] `storage/logs/` not publicly accessible
- [ ] Directory browsing disabled

---

## 📧 OPTIONAL: EMAIL SETUP

- [ ] Updated MAIL_* settings in .env
- [ ] Tested email sending (contact form)
- [ ] Verified emails being received

---

## 📊 MONITORING & LOGS

### Initial Monitoring
- [ ] Checked `storage/logs/laravel.log` for errors
- [ ] Checked cPanel error logs
- [ ] Monitored browser console for JS errors
- [ ] Set up Google Analytics (if needed)

---

## 🎉 FINAL CHECKS

### Go Live Checklist
- [ ] All features tested and working
- [ ] No console errors
- [ ] No 404 errors on navigation
- [ ] SSL certificate active and working
- [ ] Contact form working
- [ ] Admin panel accessible and secure
- [ ] Default credentials changed
- [ ] Performance acceptable (page load times)
- [ ] Mobile version working

### Documentation
- [ ] Saved database credentials securely
- [ ] Saved FTP credentials securely
- [ ] Documented admin login URL
- [ ] Saved backup of .env file (securely, not in Git)

### Backup
- [ ] Created initial backup of database
- [ ] Downloaded uploaded files as backup
- [ ] Saved local copy of project

---

## 🚀 POST-DEPLOYMENT

### 24 Hours After Launch
- [ ] Monitored error logs
- [ ] Checked for any 500 errors
- [ ] Verified contact form emails being received
- [ ] Monitored server resource usage
- [ ] No major issues reported

### 1 Week After Launch
- [ ] Performance review
- [ ] User feedback collected
- [ ] Minor issues addressed
- [ ] Database backup taken

---

## 📞 IMPORTANT URLS TO SAVE

```
Main Website: https://yourdomain.com
API Base URL: https://api.yourdomain.com/api
Admin Login: https://yourdomain.com/admin/login
hPanel URL: https://hpanel.hostinger.com
```

---

## 🆘 TROUBLESHOOTING CONTACTS

**Hostinger Support**
- Email: support@hostinger.com  
- Live Chat: Available in hPanel

**Error Logs Location**
- Laravel: `public_html/api/storage/logs/laravel.log`
- Server: Available in hPanel → Error Logs

---

## ✨ CONGRATULATIONS!

If all items are checked, your application is successfully deployed! 🎉

**Remember:**
- Keep local development environment synced
- Take regular database backups
- Monitor logs regularly
- Update dependencies periodically

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Domain:** _______________
**Notes:** _______________________________________________
