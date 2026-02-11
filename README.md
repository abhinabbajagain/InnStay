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

### Prerequisites
- Python 3.7+
- MySQL Server
- Git

### Steps
1. Clone the repository
   ```bash
   git clone https://github.com/abhinabbajagain/InnStay.git
   cd InnStay
   ```

2. Create virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Setup database
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. Configure environment variables
   - Create `.env` file in backend folder
   - Add database credentials

6. Run the application
   ```bash
   python backend/app.py
   ```

7. Access at `http://localhost:5000`

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
