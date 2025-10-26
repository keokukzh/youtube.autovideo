@echo off
setlocal enabledelayedexpansion

REM ContentMultiplier.io Project Setup Script for Windows
REM This script sets up a new project from the template

echo 🚀 ContentMultiplier.io Project Setup Script
echo ==============================================
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm and try again.
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] git is not installed. Please install git and try again.
    exit /b 1
)

echo [SUCCESS] All prerequisites are installed

REM Get project details
echo [INFO] Getting project details...

set /p PROJECT_NAME="Enter project name (default: my-saas-app): "
if "%PROJECT_NAME%"=="" set PROJECT_NAME=my-saas-app

set /p PROJECT_DESCRIPTION="Enter project description (default: A Next.js SaaS application): "
if "%PROJECT_DESCRIPTION%"=="" set PROJECT_DESCRIPTION=A Next.js SaaS application

set /p AUTHOR_NAME="Enter author name (default: Developer): "
if "%AUTHOR_NAME%"=="" set AUTHOR_NAME=Developer

set /p AUTHOR_EMAIL="Enter author email (default: developer@example.com): "
if "%AUTHOR_EMAIL%"=="" set AUTHOR_EMAIL=developer@example.com

echo [SUCCESS] Project details collected

REM Create project directory
echo [INFO] Creating project directory...

if exist "%PROJECT_NAME%" (
    echo [WARNING] Directory %PROJECT_NAME% already exists
    set /p REMOVE_EXISTING="Do you want to remove it and continue? (y/N): "
    if /i "%REMOVE_EXISTING%"=="y" (
        rmdir /s /q "%PROJECT_NAME%"
        echo [SUCCESS] Removed existing directory
    ) else (
        echo [ERROR] Cannot continue with existing directory
        exit /b 1
    )
)

mkdir "%PROJECT_NAME%"
cd "%PROJECT_NAME%"

echo [SUCCESS] Project directory created: %PROJECT_NAME%

REM Copy template files
echo [INFO] Copying template files...

set SCRIPT_DIR=%~dp0
set TEMPLATE_DIR=%SCRIPT_DIR%..\templates\nextjs-saas

if not exist "%TEMPLATE_DIR%" (
    echo [ERROR] Template directory not found: %TEMPLATE_DIR%
    exit /b 1
)

xcopy "%TEMPLATE_DIR%\*" . /E /I /Y >nul

echo [SUCCESS] Template files copied

REM Update package.json
echo [INFO] Updating package.json...

powershell -Command "(Get-Content package.json) -replace '\"name\": \"contentmultiplier\"', '\"name\": \"%PROJECT_NAME%\"' | Set-Content package.json"
powershell -Command "(Get-Content package.json) -replace '\"description\": \"A complete SaaS application\"', '\"description\": \"%PROJECT_DESCRIPTION%\"' | Set-Content package.json"
powershell -Command "(Get-Content package.json) -replace '\"author\": \"ContentMultiplier Team\"', '\"author\": \"%AUTHOR_NAME% ^<%AUTHOR_EMAIL%^>\"' | Set-Content package.json"

echo [SUCCESS] package.json updated

REM Create environment file
echo [INFO] Creating environment file...

if not exist ".env.local" (
    copy env.example .env.local >nul
    echo [SUCCESS] Environment file created: .env.local
    echo [WARNING] Please update .env.local with your actual API keys
) else (
    echo [WARNING] Environment file already exists
)

REM Initialize git repository
echo [INFO] Initializing git repository...

if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit from template"
    echo [SUCCESS] Git repository initialized
) else (
    echo [WARNING] Git repository already exists
)

REM Install dependencies
echo [INFO] Installing dependencies...

npm install

echo [SUCCESS] Dependencies installed

REM Run initial setup
echo [INFO] Running initial setup...

npm run type-check
npm run format

echo [SUCCESS] Initial setup completed

REM Display next steps
echo.
echo [SUCCESS] Project setup completed successfully!
echo.
echo Next steps:
echo 1. Update .env.local with your API keys:
echo    - Supabase URL and keys
echo    - Stripe keys
echo    - OpenAI API key (if using AI features)
echo.
echo 2. Set up your database:
echo    - Create a Supabase project
echo    - Run migrations: supabase db push
echo    - Generate types: supabase gen types typescript --local ^> lib/database.types.ts
echo.
echo 3. Start development:
echo    cd %PROJECT_NAME%
echo    npm run dev
echo.
echo 4. Run tests:
echo    npm run test
echo    npm run test:e2e
echo.
echo 5. Deploy to Vercel:
echo    - Push to GitHub
echo    - Connect to Vercel
echo    - Add environment variables
echo.
echo For more information, see the README.md file

pause
