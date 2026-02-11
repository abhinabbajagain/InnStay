#!/bin/bash

# InnStay - Quick Setup Script for Linux/macOS

clear
echo ""
echo "========================================"
echo "InnStay - Hotel Booking System"
echo "Quick Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python from https://www.python.org"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"
echo ""

# Step 1: Install backend dependencies
echo "Step 1: Installing backend dependencies..."
cd "$(dirname "$0")/backend"
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Step 2: Create .env file if it doesn't exist
echo "Step 2: Checking for .env configuration..."
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your Amadeus API credentials!"
    echo ""
    echo "1. Get free credentials at: https://developers.amadeus.com/"
    echo "2. Copy your Client ID and Client Secret"
    echo "3. Edit .env file and replace the placeholder values"
    echo "4. Run this script again"
    echo ""
    exit 1
fi
echo "✓ .env file found"
echo ""

# Step 3: Start backend server
echo "Step 3: Starting backend API server..."
echo ""
echo "Backend will start at: http://localhost:5000"
echo "(You can use Ctrl+C to stop it)"
echo ""
sleep 3

python3 app.py &
BACKEND_PID=$!

# Step 4: Navigate to frontend
cd "$(dirname "$0")/frontend"
echo ""
echo "Step 4: Starting frontend development server..."
echo ""
echo "Frontend will start at: http://localhost:8000"
echo "(You can use Ctrl+C to stop it)"
echo ""
sleep 3

echo ""
echo "========================================"
echo "✓ Setup Complete!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:8000"
echo ""
echo "Opening browser in 5 seconds..."
echo ""
sleep 5

# Try to open browser (different commands for different OS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:8000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:8000 &
fi

# Start frontend server
python3 -m http.server 8000

# Cleanup on exit
cleanup() {
    kill $BACKEND_PID 2>/dev/null
}
trap cleanup EXIT
