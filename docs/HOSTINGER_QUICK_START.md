# 🚀 Hostinger Deployment - Quick Start (Hindi/English)

Bhai, yeh sabse simple steps hain Hostinger pe deploy karne ke liye!

## ⚡ Fast Track (Agar jaldi hai)

### Step 1: Files Tayyar Karo
```bash
# Yeh script run karo - sab automatically ho jayega
deploy-preparation.bat
```

### Step 2: Hostinger Pe Database Banao
1. Hostinger hPanel me login karoge
2. **MySQL Databases** me jao
3. **Create New Database** click karo
4. Details note kar lo:
   - Database name
   - Database username  
   - Database password

### Step 3: Files Upload Karo

#### Frontend Upload (Main Website)
- **Kahan**: `public_html/`
- **Kya**: Frontend ke saare built files
- **Tool**: File Manager ya FileZilla

#### Backend Upload (API)
- **Kahan**: `public_html/api/`
- **Kya**: Backend folder ka saara content
- **Tool**: File Manager ya FileZilla

### Step 4: .env File Setup
1. `public_html/api/` me jao
2. `.env` file banao (File Manager me)
3. `.env.production` ka content copy kar ke paste karo
4. Database details update karo:
```env
DB_DATABASE=apna_database_name
DB_USERNAME=apna_database_username
DB_PASSWORD=apna_database_password
```

### Step 5: Domain Setup
1. **Subdomains** section me jao
2. `api` subdomain banao
3. Point karo: `public_html/api/public`

### Step 6: SSL Enable Karo
1. **SSL** section me jao
2. **Let's Encrypt** activate karo
3. Force HTTPS enable karo

### Step 7: Database Migration
SSH se (agar available hai):
```bash
cd public_html/api
php artisan migrate --force
php artisan db:seed --force
```

**Agar SSH nahi hai**: phpMyAdmin use karke manual migration karo

### Step 8: Test Karo! 🎉
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com/api/tours`
- Admin: `https://yourdomain.com/admin`

---

## 🆘 Common Problems (Agar kuch problem aaye)

### Problem: 500 Error aa raha hai
**Solution:**
```bash
# File permissions check karo
chmod -R 755 storage bootstrap/cache
```

### Problem: Database connect nahi ho raha
**Solution:**
- `.env` file me credentials check karo
- `DB_HOST` try karo: `localhost` ya `127.0.0.1`

### Problem: Frontend me data load nahi ho raha
**Solution:**
- Browser console me check karo kya error hai
- API URL sahi hai ya nahi verify karo
- CORS settings check karo

### Problem: Images upload nahi ho rahi
**Solution:**
- Cloudinary credentials check karo
- `storage/` folder permissions: `chmod -R 775 storage`

---

## 📞 Important Files Location

### Hostinger Server Pe:
```
public_html/
├── index.html              (Frontend homepage)
├── _next/                  (Frontend files)
├── .htaccess              (Frontend routing)
└── api/                   (Backend Laravel)
    ├── .env               (❗ Important - Configure this)
    ├── app/
    ├── config/
    ├── database/
    ├── public/            (Laravel public folder)
    │   └── index.php      (Entry point)
    ├── routes/
    ├── storage/           (Permissions: 755)
    └── vendor/
```

### Local Machine Pe (Before Upload):
```
In-Silk_Yatra/
├── frontend/
│   └── .next/            (Built files - Upload these)
└── backend/              (Upload complete folder)
```

---

## ✅ Final Checklist

Upload se pehle check karo:
- [ ] `deploy-preparation.bat` run kiya
- [ ] Frontend built hai (`npm run build`)
- [ ] Backend `.env.production` me credentials update kiye
- [ ] Hostinger pe database create kiya
- [ ] node_modules folder upload nahi kar rahe

Upload ke baad:
- [ ] `.env` file server pe banai
- [ ] File permissions set kiye (755/775)
- [ ] Database migrations run kiye
- [ ] SSL certificate activate kiya
- [ ] Subdomain setup kiya (api.yourdomain.com)
- [ ] Admin panel test kiya
- [ ] Contact form test kiya

---

## 🎯 Pro Tips

1. **FileZilla Use Karo**: File Manager se better hai large files ke liye
2. **Backup Lo**: Upload se pehle local backup lo
3. **Test Locally First**: Local pe sab kuch test kar lo
4. **SSH Access**: Agar available hai to use karo - bahut easy hai
5. **Logs Check Karo**: `storage/logs/laravel.log` me errors check karte raho

---

## 📱 WhatsApp Support Settings

`.env` me WhatsApp number set karo:
```env
WHATSAPP_NUMBER=+971123456789
```

Frontend me `lib/api.ts` me verify karo.

---

## 🔒 Security Check

Production me ye sab **must** set karo:
```env
APP_ENV=production
APP_DEBUG=false           # ❗ Important
SESSION_SECURE_COOKIE=true
```

CORS me apna domain add karo:
```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 🚀 Ready to Go Live?

Agar sab ready hai, to:

1. **Double check** all settings
2. **Upload** files
3. **Test** everything
4. **Monitor** logs for first few hours
5. **Celebrate** 🎉

**Detailed guide chahiye?** Dekho: `HOSTINGER_DEPLOYMENT_GUIDE.md`

Koi problem ho to logs check karo aur troubleshooting guide follow karo!

Good luck! 💪
