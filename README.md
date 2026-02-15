# InnStay - Hotel Booking System

A modern hotel booking system with MySQL backend, JWT authentication, and admin panel.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **MySQL Server 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** (optional but recommended) - [Download Workbench](https://dev.mysql.com/downloads/workbench/)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **Modern Web Browser** (Chrome, Firefox, Edge, etc.)

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/abhinabbajagain/InnStay.git
cd InnStay
```

### 2. Set Up Python Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure Database

#### Option A: Using MySQL Workbench (Recommended)

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Go to **File → Run SQL Script**
4. Select: `database/schema.sql`
5. Click **Run**

#### Option B: Using Command Line

**Windows:**
```powershell
# Replace path with your MySQL installation path
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database/schema.sql
```

**macOS/Linux:**
```bash
mysql -u root -p < database/schema.sql
```

### 5. Configure Backend Environment

Create a `.env` file in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=innstay_db
DB_PORT=3306
JWT_SECRET=innstay_secret_key_2026_change_in_production
JWT_EXPIRY_HOURS=24
UPLOAD_FOLDER=uploads
```

---

## 🎯 Running the Application

### Step 1: Start the Backend Server

**From the project root directory:**

```bash
cd backend
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**Keep this terminal window open!**

### Step 2: Open the Website

#### For Public Users:
Open in your browser:
```
file:///D:/Assignment%203rd/Web%20Technology/InnStay/frontend/index.html
```

Or simply double-click: `frontend/index.html`

#### For Admin Panel:
Open in your browser:
```
file:///D:/Assignment%203rd/Web%20Technology/InnStay/admin/login.html
```

Or simply double-click: `admin/login.html`

---

## 🔐 Admin Login Credentials

**Email:** `admin@gmail.com`  
**Password:** `ADMIN123`

⚠️ **This is the ONLY account with admin access!**

---

## 📂 Project Structure

```
InnStay/
├── frontend/               # Public-facing website
│   ├── index.html         # Home page
│   ├── pages/
│   │   ├── login.html     # User login
│   │   ├── register.html  # User registration
│   │   ├── search.html    # Hotel search
│   │   └── hotel-details.html
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
│       ├── main.js        # Main logic
│       ├── auth.js        # Authentication
│       ├── hotel-api.js   # API client
│       └── utils.js       # Utilities
│
├── admin/                 # Admin panel
│   ├── login.html         # Admin login
│   ├── index.html         # Admin dashboard
│   ├── hotels.html        # Hotel management
│   ├── users.html         # User management
│   ├── bookings.html      # Booking management
│   ├── reviews.html       # Review management
│   ├── css/
│   │   └── admin-style.css
│   └── js/
│       ├── admin-auth.js  # Admin authentication
│       ├── admin-login.js # Admin login logic
│       └── admin-hotels.js # Hotel CRUD
│
├── backend/               # Flask API server
│   ├── app.py            # Main API application
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Environment template
│   └── uploads/          # Uploaded images
│
└── database/
    └── schema.sql        # MySQL database schema
```

---

## 🔧 Features

### Public Features
- 🏠 Browse hotels with beautiful UI
- 🔍 Search and filter hotels
- 🔐 User registration and login
- 📱 Fully responsive design
- ⭐ View hotel ratings and reviews
- 🖼️ Hotel image galleries

### Admin Features
- 🔒 Secure JWT authentication
- 🏨 Full hotel CRUD (Create, Read, Update, Delete)
- 👥 User management
- 📅 Booking management
- 📝 Review management
- 📊 Admin dashboard
- 🖼️ Image upload support

---

## 🛠️ Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError`**
```bash
# Make sure virtual environment is activated
pip install -r backend/requirements.txt
```

**Error: `mysql.connector.errors.ProgrammingError`**
- Check your `.env` file has correct MySQL credentials
- Ensure MySQL server is running
- Verify database exists: `SHOW DATABASES;`

### "Unable to sign in right now"

1. Check Flask backend is running on `http://localhost:5000`
2. Test health endpoint: `http://localhost:5000/api/health`
3. Verify database has admin user:
   ```sql
   SELECT * FROM users WHERE email = 'admin@gmail.com';
   ```

### "Can't save hotels"

1. Ensure you're logged in as admin
2. Check browser console for errors (F12)
3. Verify JWT token is stored:
   - Open DevTools (F12) → Application → Local Storage
   - Check for `authToken`

### Database connection failed

1. Start MySQL service:
   - **Windows:** Services → MySQL → Start
   - **macOS:** `brew services start mysql`
   - **Linux:** `sudo systemctl start mysql`

2. Test connection:
   ```bash
   mysql -u root -p
   ```

---

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin Endpoints (Requires JWT)
- `GET /api/auth/me` - Get current user
- `GET /api/admin/hotels` - List all hotels (admin)
- `POST /api/admin/hotels` - Create hotel
- `PUT /api/admin/hotels/:id` - Update hotel
- `DELETE /api/admin/hotels/:id` - Delete hotel
- `POST /api/admin/uploads` - Upload images

---

## 📝 Development Notes

### Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Python Flask
- **Database:** MySQL 8.0
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Werkzeug (scrypt)

### Database Schema
The database includes:
- `users` - User accounts (admin/regular users)
- `hotels` - Hotel listings with full details
- `rooms` - Room types and availability
- `bookings` - Customer bookings
- `reviews` - Hotel reviews and ratings
- `payments` - Payment transactions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Abhinab Baja**  
Repository: [github.com/abhinabbajagain/InnStay](https://github.com/abhinabbajagain/InnStay)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review browser console for errors (F12)
3. Check Flask terminal for backend errors
4. Verify all prerequisites are installed
5. Ensure MySQL service is running

**Happy Coding! 🎉**
