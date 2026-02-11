@echo off
REM InnStay - Quick Setup Script for Windows

echo.
echo ========================================
echo InnStay - Hotel Booking System
echo Quick Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)

echo ✓ Python found
echo.

REM Step 1: Install backend dependencies
echo Step 1: Installing backend dependencies...
cd %~dp0backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Step 2: Create .env file if it doesn't exist
echo Step 2: Checking for .env configuration...
if not exist ".env" (
    echo.
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your Amadeus API credentials!
    echo.
    echo 1. Get free credentials at: https://developers.amadeus.com/
    echo 2. Copy your Client ID and Client Secret
    echo 3. Open .env file and replace the placeholder values
    echo 4. Run this script again
    pause
    exit /b 1
)
echo ✓ .env file found
echo.

REM Step 3: Start backend server
echo Step 3: Starting backend API server...
echo.
echo Backend will start at: http://localhost:5000
echo (You can use Ctrl+C to stop it)
echo.
timeout /t 3 /nobreak

start "InnStay Backend API" python app.py

REM Step 4: Navigate to frontend
cd %~dp0frontend
echo.
echo Step 4: Starting frontend development server...
echo.
echo Frontend will start at: http://localhost:8000
echo (You can use Ctrl+C to stop it)
echo.
timeout /t 3 /nobreak

REM Step 5: Start frontend server
echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8000
echo.
echo Opening browser in 5 seconds...
echo.
timeout /t 5 /nobreak

start http://localhost:8000

python -m http.server 8000

pause
