@echo off
echo ============================================
echo IN-SILK YATRA DMC - Deployment Preparation
echo ============================================
echo.

:: Check if user wants to continue
set /p continue="Do you want to prepare files for Hostinger deployment? (Y/N): "
if /i not "%continue%"=="Y" goto :end

echo.
echo [1/6] Building Frontend...
echo ============================================
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend npm install failed!
    pause
    exit /b 1
)

echo.
echo Creating production .env file...
if not exist .env.production (
    copy .env.production.example .env.production
    echo Created .env.production - Please update API URL!
    echo Edit frontend\.env.production and set your domain
    pause
)

call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/6] Installing Backend Dependencies...
echo ============================================
cd backend
call composer install --optimize-autoloader --no-dev
if errorlevel 1 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/6] Clearing Backend Caches...
echo ============================================
cd backend
call php artisan config:clear
call php artisan route:clear
call php artisan view:clear
call php artisan cache:clear
cd ..

echo.
echo [4/6] Creating Production .env Template...
echo ============================================
if not exist backend\.env.production (
    echo .env.production already created!
) else (
    echo Please edit backend\.env.production with your Hostinger credentials
)

echo.
echo [5/6] Creating Deployment Package...
echo ============================================
echo Creating list of files to upload...

:: Create a checklist file
echo # Files Ready for Upload > UPLOAD_CHECKLIST.txt
echo. >> UPLOAD_CHECKLIST.txt
echo ## Frontend Files >> UPLOAD_CHECKLIST.txt
echo Upload contents to: public_html/ >> UPLOAD_CHECKLIST.txt
echo Source: frontend\.next\ or frontend\out\ >> UPLOAD_CHECKLIST.txt
echo. >> UPLOAD_CHECKLIST.txt
echo ## Backend Files >> UPLOAD_CHECKLIST.txt
echo Upload to: public_html\api\ >> UPLOAD_CHECKLIST.txt
echo Source: backend\ (entire folder) >> UPLOAD_CHECKLIST.txt
echo. >> UPLOAD_CHECKLIST.txt
echo ## IMPORTANT: DO NOT UPLOAD >> UPLOAD_CHECKLIST.txt
echo - node_modules\ >> UPLOAD_CHECKLIST.txt
echo - .git\ >> UPLOAD_CHECKLIST.txt
echo - tests\ >> UPLOAD_CHECKLIST.txt
echo - .env (create fresh on server) >> UPLOAD_CHECKLIST.txt
echo - *.log files >> UPLOAD_CHECKLIST.txt

echo.
echo [6/6] Preparation Complete! ✓
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Edit backend\.env.production with your Hostinger database details
echo 2. Edit frontend\.env.production with your API URL
echo 3. Rebuild frontend: cd frontend ^&^& npm run build
echo 4. Follow HOSTINGER_DEPLOYMENT_GUIDE.md for upload instructions
echo 5. Upload files via FTP or Hostinger File Manager
echo.
echo Files are ready in:
echo - Frontend: frontend\.next\ or frontend\out\
echo - Backend: backend\
echo.
echo See UPLOAD_CHECKLIST.txt for details
echo.

:end
pause
