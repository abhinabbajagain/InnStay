# InnStay - Hotel Booking System

A modern, responsive hotel booking platform built with Flask, MySQL, and Bootstrap.

## Features

### Core Features
- ✅ User Registration & Authentication
- ✅ Hotel Search & Advanced Filtering
- ✅ Room Booking System
- ✅ User Dashboard
- ✅ Admin Panel
- ✅ Booking History & Management
- ✅ Hotel & Room Reviews
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### Advanced Features
- 🚀 Email Notifications (Booking Confirmations)
- 🚀 File Upload (Hotel Images)
- 🚀 Payment Gateway Integration
- 🚀 User Roles & Permissions

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap/Tailwind
- **Backend**: Python 3.x, Flask
- **Database**: MySQL
- **Version Control**: Git

## Project Structure

```
InnStay/
├── frontend/           # HTML, CSS, JavaScript files
│   ├── css/
│   ├── js/
│   ├── images/
│   └── pages/
├── backend/           # Flask application
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── templates/
│   └── requirements.txt
├── database/          # MySQL schemas & migrations
│   └── schema.sql
├── docs/              # Screenshots, testing docs
│   ├── screenshots/
│   ├── testing/
│   └── deployment.md
├── .gitignore
└── README.md
```

## Installation & Setup

### Quick Start (with API)

**Windows:**
```bash
.\setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

**Prerequisites**
- Python 3.7+
- Git

**Steps**

1. Clone repository
   ```bash
   git clone https://github.com/abhinabbajagain/InnStay.git
   cd InnStay
   ```

2. Install dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configure API (optional but recommended)
   - Get free Amadeus API credentials: https://developers.amadeus.com/
   - Copy `.env.example` to `.env`
   - Add your API credentials to `.env`

4. Start backend API server
   ```bash
   cd backend
   python app.py
   ```
   Server runs at: `http://localhost:5000`

5. Start frontend (in new terminal)
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Access app at: `http://localhost:8000`

### Using Without API

If you don't want to set up the API:
1. In `frontend/js/main.js`, change `useLocalData: false` to `useLocalData: true`
2. Skip the backend setup - app uses 8 fallback hotels
3. Frontend still works locally

## Third-Party API Integration

InnStay now integrates with **Amadeus Hotel API** for real-time hotel data!

### Features
- ✅ Real hotel data from Amadeus
- ✅ Automatic fallback to 8 local hotels if API unavailable
- ✅ Error handling and graceful degradation
- ✅ Works offline with local data
- ✅ Free tier (no credit card required)

### Setup Guide
See [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md) for complete integration instructions

## User Roles

- **Guest**: Browse hotels, view details
- **User**: Register, book hotels, manage bookings, leave reviews
- **Admin**: Manage hotels, rooms, users, view bookings, analytics

## Documentation

- [User Manual](docs/USER_MANUAL.md)
- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Testing Reports](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Screenshots

See [Screenshots](docs/screenshots/) for UI walkthrough across all devices.

## Testing

Comprehensive testing documentation available in [TESTING.md](docs/TESTING.md):
- Unit tests
- Integration tests
- Browser compatibility
- Responsive design testing

## Future Enhancements

- [ ] Mobile app
- [ ] Advanced analytics
- [ ] AI-based recommendations
- [ ] Social sharing features

## License

This project is for educational purposes.

## Author

[Your Name]
