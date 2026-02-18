# Windows Setup Guide - IN-SILK YATRA DMC

## Prerequisites Installation

### 1. Install PHP

**Option A: Using XAMPP (Recommended for beginners)**
1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP (includes PHP, MySQL, Apache)
3. Add PHP to PATH:
   - Open System Properties → Environment Variables
   - Edit "Path" variable
   - Add: `C:\xampp\php` (or your XAMPP installation path)
   - Click OK

**Option B: Using PHP Standalone**
1. Download PHP from: https://windows.php.net/download/
2. Extract to `C:\php`
3. Add `C:\php` to your system PATH
4. Rename `php.ini-development` to `php.ini`
5. Enable required extensions in `php.ini`:
   ```
   extension=mysqli
   extension=pdo_mysql
   extension=openssl
   extension=mbstring
   extension=curl
   ```

### 2. Install Composer

**Method 1: Using Composer Installer (Recommended)**
1. Download Composer-Setup.exe from: https://getcomposer.org/download/
2. Run the installer
3. It will automatically detect your PHP installation
4. Complete the installation
5. Verify installation:
   ```bash
   composer --version
   ```

**Method 2: Manual Installation**
1. Download `composer.phar` from: https://getcomposer.org/composer-stable.phar
2. Save it to `C:\php\composer.phar`
3. Create `C:\php\composer.bat` with content:
   ```batch
   @echo off
   php "%~dp0composer.phar" %*
   ```
4. Add `C:\php` to your system PATH
5. Verify installation:
   ```bash
   composer --version
   ```

### 3. Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Install the LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 4. Install MySQL

**Option A: Using XAMPP**
- MySQL is included with XAMPP
- Access via phpMyAdmin: http://localhost/phpmyadmin

**Option B: Standalone MySQL**
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server
3. Remember the root password you set during installation

## Verification Steps

Open a **new** Command Prompt or PowerShell window and run:

```bash
# Check PHP
php --version

# Check Composer
composer --version

# Check Node.js
node --version
npm --version

# Check MySQL (if using XAMPP)
mysql --version
```

## Troubleshooting

### Composer not found after installation

1. **Restart your terminal/IDE** - PATH changes require restart
2. **Check PATH manually**:
   - Open System Properties → Environment Variables
   - Verify `C:\php` (or your PHP path) is in PATH
   - Verify Composer path is in PATH (usually `C:\Users\YourName\AppData\Roaming\Composer\vendor\bin`)

3. **Use full path temporarily**:
   ```bash
   C:\Users\YourName\AppData\Roaming\Composer\vendor\bin\composer.bat install
   ```

### PHP extensions missing

If you get errors about missing extensions:
1. Open `php.ini` file
2. Find the extension line (remove semicolon `;` to enable):
   ```ini
   extension=mysqli
   extension=pdo_mysql
   extension=openssl
   extension=mbstring
   extension=curl
   extension=fileinfo
   extension=gd
   ```
3. Restart your web server (if using XAMPP)

### Port conflicts

If port 8000 is already in use:
```bash
# Use a different port
php artisan serve --port=8001
```

Then update frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

## Quick Setup After Installation

Once all tools are installed:

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Edit .env file with your database credentials
# Then run:
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local

npm run dev
```

## Alternative: Using WSL (Windows Subsystem for Linux)

If you prefer Linux environment on Windows:

1. Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install
2. Install Ubuntu from Microsoft Store
3. Follow Linux setup instructions in QUICK_START.md

## Need Help?

- **Composer Issues**: https://getcomposer.org/doc/00-intro.md
- **PHP Issues**: https://www.php.net/manual/en/install.windows.php
- **Laravel Issues**: https://laravel.com/docs/10.x/installation
