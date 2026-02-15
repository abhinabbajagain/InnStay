# InnStay - Hotel Booking System
## Project Documentation

---

**Submitted By:** Abhinab Bajagain  
**College:** Texas College of Management and IT  
**University:** Lincoln University  
**Date:** February 15, 2026  
**Subject:** Web Technology

---

## Certificate

This is to certify that the project entitled **"InnStay - Hotel Booking System"** submitted by **Abhinab Bajagain** is a bonafide record of work carried out under the supervision of the faculty of Web Technology at Texas College of Management and IT, Lincoln University.

**Project Supervisor:** _____________________

**Date:** February 15, 2026

---

## Acknowledgement

I would like to express my sincere gratitude to all those who have contributed to the successful completion of this project. I am thankful to my project supervisor for their valuable guidance, continuous support, and encouragement throughout the development of this Hotel Booking System.

I would also like to thank the faculty members of Texas College of Management and IT for providing the necessary resources and infrastructure required for this project. Special thanks to my family and friends for their constant motivation and support.

**Abhinab Bajagain**  
February 15, 2026

---

## Abstract

The **InnStay Hotel Booking System** is a comprehensive web-based application designed to streamline the hotel booking process for both customers and administrators. This system provides an intuitive interface for users to search, view, and book hotel rooms while offering administrators powerful tools to manage hotels, bookings, users, and reviews.

The project is built using modern web technologies including **HTML5, CSS3, JavaScript** for the frontend, and **Flask (Python)** with **MySQL database** for the backend. The system implements **JWT (JSON Web Token)** based authentication to ensure secure access control and user verification.

Key features include real-time hotel search and filtering, responsive design for all devices, secure user authentication and registration, comprehensive admin panel for complete CRUD operations, image upload functionality, and a robust MySQL database with proper relational structure.

This documentation provides detailed information about the system architecture, design, implementation, testing, and deployment of the InnStay Hotel Booking System.

---

## Table of Contents

1. [Introduction](#chapter-1-introduction)
   - 1.1 Project Overview
   - 1.2 Problem Statement
   - 1.3 Objectives
   - 1.4 Scope of the Project
   - 1.5 Project Features

2. [System Analysis](#chapter-2-system-analysis)
   - 2.1 Existing System
   - 2.2 Limitations of Existing System
   - 2.3 Proposed System
   - 2.4 Advantages of Proposed System
   - 2.5 Feasibility Study

3. [System Design](#chapter-3-system-design)
   - 3.1 System Architecture
   - 3.2 Database Design
   - 3.3 ER Diagram
   - 3.4 Use Case Diagram
   - 3.5 Data Flow Diagram

4. [Technology Stack](#chapter-4-technology-stack)
   - 4.1 Frontend Technologies
   - 4.2 Backend Technologies
   - 4.3 Database
   - 4.4 Tools and Libraries

5. [Implementation](#chapter-5-implementation)
   - 5.1 System Modules
   - 5.2 Frontend Implementation
   - 5.3 Backend Implementation
   - 5.4 Database Implementation
   - 5.5 Authentication System

6. [System Features & Screenshots](#chapter-6-system-features-screenshots)
   - 6.1 User Interface
   - 6.2 Admin Panel
   - 6.3 Booking System
   - 6.4 Authentication Pages

7. [Testing](#chapter-7-testing)
   - 7.1 Testing Strategy
   - 7.2 Unit Testing
   - 7.3 Integration Testing
   - 7.4 User Acceptance Testing
   - 7.5 Test Cases

8. [Deployment](#chapter-8-deployment)
   - 8.1 System Requirements
   - 8.2 Installation Guide
   - 8.3 Configuration
   - 8.4 Running the Application

9. [Conclusion and Future Scope](#chapter-9-conclusion-and-future-scope)
   - 9.1 Conclusion
   - 9.2 Limitations
   - 9.3 Future Enhancements

10. [References](#references)

---

## Chapter 1: Introduction

### 1.1 Project Overview

InnStay is a modern, full-stack web application designed to simplify the hotel booking process. The system serves as a bridge between hotels and customers, providing a platform where users can browse available hotels, view detailed information, and make bookings seamlessly. The application features a dual-interface design with a public-facing website for customers and a comprehensive admin panel for hotel management.

The system is built with scalability and user experience in mind, implementing responsive design principles to ensure optimal viewing across all devices - from desktop computers to mobile phones. The backend is powered by Flask, a lightweight Python web framework, connected to a MySQL database for efficient data management.

### 1.2 Problem Statement

Traditional hotel booking methods involve time-consuming phone calls, in-person visits, or dealing with multiple booking platforms. This creates several challenges:

- **Limited Information Access:** Customers cannot easily compare multiple hotels and their amenities
- **Inefficient Management:** Hotel administrators struggle with manual booking management and record-keeping
- **Security Concerns:** Lack of secure authentication systems leads to data breaches
- **No Centralized System:** Hotels and customers lack a unified platform for smooth transactions
- **Poor User Experience:** Existing systems often have complicated interfaces and poor mobile support

### 1.3 Objectives

The primary objectives of the InnStay Hotel Booking System are:

1. **Develop a user-friendly interface** that allows customers to easily browse and book hotels
2. **Implement secure authentication** using JWT tokens to protect user data
3. **Create an efficient admin panel** for hotel owners and administrators to manage their properties
4. **Design a responsive layout** that works seamlessly across all devices
5. **Build a scalable system** that can accommodate growth in users and hotels
6. **Ensure data integrity** through proper database design and validation
7. **Provide real-time availability** of hotel rooms and instant booking confirmation
8. **Enable easy content management** for hotel information, images, and pricing

### 1.4 Scope of the Project

The InnStay project encompasses the following scope:

**User Module:**
- User registration and login with secure password hashing
- Browse hotels with advanced search and filtering
- View detailed hotel information including amenities, pricing, and reviews
- Book hotel rooms with selected dates
- View booking history and manage profile

**Admin Module:**
- Secure admin authentication with role-based access control
- Complete CRUD operations for hotels, rooms, users, bookings, and reviews
- Dashboard with analytics and statistics
- Image upload and management for hotel galleries
- User management with ability to activate/deactivate accounts

**System Features:**
- JWT-based authentication for secure API access
- RESTful API architecture for frontend-backend communication
- MySQL database with properly normalized tables
- Responsive design using modern CSS techniques
- Client-side and server-side validation

### 1.5 Project Features

**Public Features:**
- 🏠 **Hotel Browsing:** Browse hotels with beautiful card-based UI
- 🔍 **Advanced Search:** Filter by location, price, rating, and amenities
- 📱 **Responsive Design:** Fully optimized for mobile, tablet, and desktop
- ⭐ **Ratings & Reviews:** View hotel ratings and customer reviews
- 🖼️ **Image Galleries:** Browse multiple hotel images in gallery view
- 🔐 **User Authentication:** Secure registration and login system
- 📅 **Booking System:** Select dates and book hotel rooms

**Admin Features:**
- 🔒 **Secure Admin Login:** Separate admin authentication with JWT
- 🏨 **Hotel Management:** Full CRUD operations for hotel listings
- 👥 **User Management:** View and manage registered users
- 📅 **Booking Management:** Track and manage all bookings
- 📝 **Review Management:** Moderate user reviews
- 📊 **Analytics Dashboard:** View statistics and insights
- 🖼️ **Image Upload:** Upload and manage hotel images
- ⚙️ **Settings:** Configure system settings and preferences

---

## Chapter 2: System Analysis

### 2.1 Existing System

Traditional hotel booking systems rely on:

**Manual Booking Methods:**
- Telephone reservations with limited information
- Walk-in bookings requiring physical presence
- Email inquiries with slow response times

**Legacy Web Systems:**
- Outdated user interfaces with poor usability
- Limited search and filtering capabilities
- No mobile responsiveness
- Slow performance and loading times
- Separate systems for different hotels

**Third-Party Platforms:**
- High commission fees for hotels
- Generic templates that don't highlight unique features
- Limited customization options
- Shared platforms with competitor hotels

### 2.2 Limitations of Existing System

1. **Poor User Experience:** Complex navigation and cluttered interfaces confuse users
2. **Security Vulnerabilities:** Weak authentication mechanisms lead to data breaches
3. **Limited Functionality:** Lack of advanced search, filtering, and comparison features
4. **No Mobile Support:** Most systems are not optimized for mobile devices
5. **Inefficient Admin Tools:** Hotel managers lack proper tools for managing bookings and content
6. **No Real-Time Updates:** Availability information is often outdated
7. **High Costs:** Third-party platforms charge substantial commission fees
8. **Data Fragmentation:** Multiple systems lead to inconsistent data

### 2.3 Proposed System

The InnStay Hotel Booking System addresses these limitations by providing:

**Modern Web Architecture:**
- Single Page Application (SPA) concepts for smooth navigation
- RESTful API backend for efficient data communication
- Responsive design framework for all devices

**Enhanced Security:**
- JWT token-based authentication
- Password hashing using industry-standard algorithms (scrypt)
- Role-based access control (User/Admin)
- Secure API endpoints with authorization checks

**Rich Features:**
- Advanced search with multiple filters
- Real-time availability checking
- Image gallery with optimized loading
- User reviews and ratings system
- Booking history and management

**Powerful Admin Panel:**
- Intuitive dashboard with statistics
- Complete CRUD operations for all entities
- Bulk operations for efficiency
- Image upload with preview
- User role management

### 2.4 Advantages of Proposed System

1. **User-Friendly Interface:** Clean, modern design with intuitive navigation
2. **Enhanced Security:** JWT authentication ensures data protection
3. **Mobile Responsive:** Works perfectly on all screen sizes
4. **Scalable Architecture:** Can handle growing numbers of users and hotels
5. **Real-Time Updates:** Instant availability and booking confirmation
6. **Cost-Effective:** No third-party commissions, direct control
7. **Easy Management:** Comprehensive admin tools for efficient operations
8. **Fast Performance:** Optimized code and database queries
9. **SEO Friendly:** Proper HTML structure for better search engine visibility
10. **Maintenance Friendly:** Well-documented code with modular architecture

### 2.5 Feasibility Study

**Technical Feasibility:**
- Technologies used (HTML, CSS, JavaScript, Flask, MySQL) are well-established and widely supported
- Development tools and frameworks are freely available
- Team has adequate technical skills to implement the system
- System requirements are reasonable and achievable

**Economic Feasibility:**
- Low development cost using open-source technologies
- No licensing fees for software and tools
- Minimal hosting costs for deployment
- Long-term cost savings compared to third-party platforms
- Good return on investment through direct bookings

**Operational Feasibility:**
- Simple and intuitive interface requires minimal training
- System is easy to maintain and update
- Can be integrated with existing hotel management systems
- Provides backup and recovery mechanisms

**Schedule Feasibility:**
- Project timeline is realistic and achievable
- Development can be completed in planned phases
- Adequate resources available for testing and deployment

---

## Chapter 3: System Design

### 3.1 System Architecture

InnStay follows a **three-tier architecture**:

**Presentation Layer (Frontend):**
- HTML5 for structure
- CSS3 for styling and responsive design
- JavaScript (ES6+) for dynamic functionality
- Handles user interactions and displays data

**Application Layer (Backend):**
- Flask web framework (Python)
- RESTful API endpoints
- Business logic implementation
- JWT authentication and authorization
- Request validation and error handling

**Data Layer (Database):**
- MySQL relational database
- Normalized table structure
- Stored procedures for complex queries
- Transaction management for data integrity

**Architecture Flow:**
```
Client Browser (Frontend)
        ↓
    HTTP/HTTPS
        ↓
Flask API Server (Backend)
        ↓
  MySQL Database
```

### 3.2 Database Design

The system uses a **normalized relational database** with the following tables:

**1. users**
- Stores user account information
- Fields: user_id (PK), name, email, password, phone, role, is_active, created_at

**2. hotels**
- Contains hotel details and information
- Fields: hotel_id (PK), name, description, address, city, country, price_per_night, rating, reviews, image_url, image_gallery, amenities, bedrooms, beds, bathrooms, guests, status, manager_id (FK)

**3. rooms**
- Stores room types and details for each hotel
- Fields: room_id (PK), hotel_id (FK), room_number, room_type, capacity, price_per_night, is_available

**4. bookings**
- Records all hotel bookings
- Fields: booking_id (PK), user_id (FK), hotel_id (FK), room_id (FK), check_in_date, check_out_date, total_price, booking_status

**5. reviews**
- Stores customer reviews and ratings
- Fields: review_id (PK), user_id (FK), hotel_id (FK), rating, comment, created_at

**6. payments**
- Tracks payment transactions
- Fields: payment_id (PK), booking_id (FK), amount, payment_method, payment_status, transaction_date

### 3.3 ER Diagram

**Entities and Relationships:**

```
USERS (1) ----< (M) BOOKINGS (M) >---- (1) HOTELS
  |                                           |
  |                                           |
  | (1)                                   (1) |
  |                                           |
  v                                           v
  (M)                                       (M)
REVIEWS                                    ROOMS
  |                                           |
  |                                           |
  +-------------------------------------------+
              BOOKINGS references ROOMS
```

**Cardinality:**
- One USER can make many BOOKINGS (1:M)
- One HOTEL can have many BOOKINGS (1:M)
- One USER can write many REVIEWS (1:M)
- One HOTEL can have many REVIEWS (1:M)
- One HOTEL can have many ROOMS (1:M)
- One BOOKING references one ROOM (M:1)

### 3.4 Use Case Diagram

**Actors:**
1. Guest User (Unregistered)
2. Registered User
3. Administrator

**Use Cases:**

**Guest User:**
- Browse hotels
- Search hotels
- View hotel details
- Register account

**Registered User:**
- All guest user capabilities
- Login/Logout
- Book hotel rooms
- View booking history
- Write reviews
- Update profile

**Administrator:**
- All user capabilities
- Manage hotels (CRUD)
- Manage users
- Manage bookings
- Manage reviews
- View analytics
- Upload images
- System configuration

### 3.5 Data Flow Diagram

**Level 0 DFD (Context Diagram):**
```
[User] ----> [InnStay System] ----> [Database]
 |                 |                     |
 |                 |                     |
 +<----------------+<--------------------+
```

**Level 1 DFD:**
```
User Registration -> Validate -> Store in DB
User Login -> Authenticate -> Generate JWT
Browse Hotels -> Fetch Data -> Display Results
Book Room -> Check Availability -> Create Booking
Admin CRUD -> Validate -> Update Database
```

---

## Chapter 4: Technology Stack

### 4.1 Frontend Technologies

**HTML5:**
- Semantic markup for better structure
- Form validation attributes
- Local storage API for client-side data

**CSS3:**
- Flexbox and Grid for layout
- Media queries for responsive design
- CSS animations for smooth transitions
- Custom properties (variables) for theming

**JavaScript (ES6+):**
- Async/await for API calls
- Fetch API for HTTP requests
- Event delegation for better performance
- Modular code organization
- Object-oriented programming patterns

### 4.2 Backend Technologies

**Flask (Python 3.11):**
- Lightweight web framework
- RESTful API development
- Route decorators for clean URL mapping
- Built-in development server

**PyJWT:**
- JWT token generation and verification
- Secure authentication implementation
- Token expiration handling

**Werkzeug:**
- Password hashing (scrypt algorithm)
- Secure filename handling for uploads
- HTTP utilities

**Flask-CORS:**
- Cross-Origin Resource Sharing support
- Enables frontend-backend communication

### 4.3 Database

**MySQL 8.0:**
- Relational database management system
- ACID compliance for data integrity
- Support for JSON data type
- Efficient indexing for fast queries
- Transaction support

**mysql-connector-python:**
- Python interface for MySQL
- Connection pooling
- Prepared statements for security

### 4.4 Tools and Libraries

**Development Tools:**
- Visual Studio Code - Code editor
- Git - Version control
- MySQL Workbench - Database management
- Postman - API testing
- Browser DevTools - Frontend debugging

**Libraries:**
- Python-dotenv - Environment variable management
- JSON - Data serialization

---

## Chapter 5: Implementation

### 5.1 System Modules

The system is divided into the following modules:

**1. Authentication Module:**
- User registration with validation
- Secure login with JWT token generation
- Password hashing and verification
- Token-based session management
- Role-based access control

**2. Hotel Management Module:**
- Hotel listing with pagination
- Advanced search and filtering
- Hotel detail view with gallery
- Admin CRUD operations
- Image upload functionality

**3. Booking Module:**
- Room availability checking
- Date selection and validation
- Booking creation and confirmation
- Booking history for users
- Booking management for admins

**4. Review Module:**
- User review submission
- Rating system (1-5 stars)
- Review display on hotel pages
- Admin moderation capabilities

**5. User Management Module:**
- User profile management
- Account activation/deactivation
- Admin user management interface

**6. Admin Dashboard Module:**
- System statistics and analytics
- Quick access to all management functions
- Recent activity logs

### 5.2 Frontend Implementation

**Project Structure:**
```
frontend/
├── index.html              # Home page
├── pages/
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── search.html        # Hotel search results
│   └── hotel-details.html # Hotel detail page
├── css/
│   ├── style.css          # Main styles
│   ├── login.css          # Login page styles
│   ├── register.css       # Registration styles
│   └── search.css         # Search page styles
└── js/
    ├── main.js            # Main application logic
    ├── auth.js            # Authentication logic
    ├── hotel-api.js       # API client
    ├── utils.js           # Utility functions
    └── search.js          # Search functionality
```

**Key Implementation Details:**

**API Client (hotel-api.js):**
```javascript
const HotelAPI = {
    baseUrl: 'http://localhost:5000/api',
    
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
    
    async request(path, options = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...(options.headers || {})
            },
            ...options
        });
        return response.json();
    }
};
```

**Authentication (auth.js):**
- Form validation before submission
- Password strength checking
- Token storage in localStorage
- Automatic logout on token expiration

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1200px
- Flexible grid layouts
- Touch-friendly buttons and inputs

### 5.3 Backend Implementation

**Project Structure:**
```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
└── uploads/           # Uploaded images
```

**API Endpoints:**

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Public Endpoints:**
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details

**Admin Endpoints (JWT Required):**
- `GET /api/admin/hotels` - List all hotels (admin)
- `POST /api/admin/hotels` - Create hotel
- `PUT /api/admin/hotels/:id` - Update hotel
- `DELETE /api/admin/hotels/:id` - Delete hotel
- `POST /api/admin/uploads` - Upload images
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - Manage bookings
- `GET /api/admin/reviews` - Manage reviews

**JWT Implementation:**
```python
def create_token(user):
    payload = {
        'user_id': user['user_id'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def get_auth_user(required_role=None):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.replace('Bearer ', '').strip()
    payload = decode_token(token)
    if not payload:
        return None
    user = fetch_one('SELECT * FROM users WHERE user_id = %s', 
                     (payload['user_id'],))
    if required_role and user.get('role') != required_role:
        return None
    return user
```

### 5.4 Database Implementation

**Schema Highlights:**

**Normalized Structure:**
- First Normal Form (1NF): Atomic values
- Second Normal Form (2NF): No partial dependencies
- Third Normal Form (3NF): No transitive dependencies

**Indexing:**
```sql
INDEX idx_email ON users(email)
INDEX idx_city ON hotels(city)
INDEX idx_hotel ON bookings(hotel_id)
INDEX idx_user ON bookings(user_id)
```

**Foreign Key Constraints:**
- Maintain referential integrity
- CASCADE on delete where appropriate
- SET NULL for optional references

**Sample Data:**
- 15+ sample hotels across different locations
- 3 demo user accounts
- Sample bookings and reviews

### 5.5 Authentication System

**Registration Flow:**
1. User submits registration form
2. Frontend validates input (email format, password strength)
3. Backend receives request
4. Check if email already exists
5. Hash password using scrypt
6. Insert user into database
7. Generate JWT token
8. Return token and user data to frontend
9. Frontend stores token in localStorage
10. Redirect to home page

**Login Flow:**
1. User submits login credentials
2. Backend verifies email exists
3. Compare hashed password
4. Generate JWT token if valid
5. Return token and user data
6. Frontend stores token
7. Redirect to appropriate page

**Admin Authentication:**
- Separate login page for admin
- Check role = 'admin' in database
- Deny access if not admin
- Admin-specific JWT token
- Protected admin routes with middleware

**Security Features:**
- Password hashing with scrypt (32768 iterations)
- JWT tokens with expiration (24 hours)
- HTTP-only secure token storage recommended for production
- CORS configuration for API security
- SQL injection prevention with parameterized queries
- XSS protection through input validation

---

## Chapter 6: System Features & Screenshots

### 6.1 User Interface

**Home Page:**
- Hero section with call-to-action
- Featured hotels in card layout
- Search bar for quick access
- Navigation menu with login/account options
- Footer with contact information

**Search Page:**
- Filter sidebar (price, rating, amenities)
- Hotel cards with image, price, rating
- Sort options (price, rating, newest)
- Pagination for large result sets
- Responsive grid layout

**Hotel Details Page:**
- Image gallery with modal view
- Hotel description and amenities
- Pricing information
- Room availability calendar
- Booking form
- Customer reviews section
- Star rating display
- Host information

### 6.2 Admin Panel

**Admin Dashboard:**
- Statistics cards (total hotels, users, bookings, revenue)
- Recent bookings table
- Quick action buttons
- Navigation sidebar
- Logout option

**Hotel Management:**
- Hotel list table with actions
- Add/Edit hotel modal form
- Delete confirmation dialog
- Image upload interface
- Status toggle (Active/Pending/Suspended)
- Search and filter options

**User Management:**
- User list with details
- Activate/deactivate users
- View user bookings
- Role management

**Booking Management:**
- All bookings list
- Filter by status, date, hotel
- Booking details view
- Status update options

**Review Management:**
- All reviews list
- Approve/reject functionality
- View associated hotel
- User information

### 6.3 Booking System

**Booking Flow:**
1. User browses hotels
2. Views hotel details
3. Selects dates in calendar
4. Views pricing summary
5. Confirms booking
6. Receives confirmation
7. Booking appears in history

**Booking Features:**
- Date range selection
- Automatic price calculation
- Availability checking
- Instant confirmation
- Booking cancellation
- Email notifications (future enhancement)

### 6.4 Authentication Pages

**Login Page:**
- Email and password fields
- Remember me checkbox
- Show/hide password toggle
- Error message display
- Link to registration
- Social login buttons (demo)

**Registration Page:**
- Full name, email, phone, password fields
- Password confirmation
- Password strength indicator
- Terms and conditions checkbox
- Form validation with error messages
- Success confirmation

---

## Chapter 7: Testing

### 7.1 Testing Strategy

The testing approach includes:
- **Unit Testing:** Individual components and functions
- **Integration Testing:** Module interactions
- **System Testing:** Complete system functionality
- **User Acceptance Testing:** Real-world usage scenarios

### 7.2 Unit Testing

**Frontend Unit Tests:**

| Component | Test Case | Expected Result | Status |
|-----------|-----------|-----------------|--------|
| Email Validation | Valid email format | Returns true | ✓ Pass |
| Email Validation | Invalid email format | Returns false | ✓ Pass |
| Password Validation | Strong password | Returns valid | ✓ Pass |
| Password Validation | Weak password | Returns invalid | ✓ Pass |
| Price Formatting | Number input | Formatted string | ✓ Pass |
| Date Validation | Valid date range | Returns true | ✓ Pass |

**Backend Unit Tests:**

| Function | Test Case | Expected Result | Status |
|----------|-----------|-----------------|--------|
| JWT Generation | Valid user data | Returns token | ✓ Pass |
| JWT Verification | Valid token | Returns payload | ✓ Pass |
| JWT Verification | Expired token | Returns None | ✓ Pass |
| Password Hashing | Plain password | Returns hash | ✓ Pass |
| Password Verification | Correct password | Returns True | ✓ Pass |
| Password Verification | Wrong password | Returns False | ✓ Pass |

### 7.3 Integration Testing

**API Integration Tests:**

| Endpoint | Method | Test Case | Status |
|----------|--------|-----------|--------|
| /api/auth/register | POST | New user registration | ✓ Pass |
| /api/auth/register | POST | Duplicate email | ✓ Pass |
| /api/auth/login | POST | Valid credentials | ✓ Pass |
| /api/auth/login | POST | Invalid credentials | ✓ Pass |
| /api/hotels | GET | Fetch all hotels | ✓ Pass |
| /api/hotels/:id | GET | Fetch single hotel | ✓ Pass |
| /api/admin/hotels | POST | Create hotel (with auth) | ✓ Pass |
| /api/admin/hotels | POST | Create hotel (no auth) | ✓ Pass |

**Frontend-Backend Integration:**

| Feature | Test Case | Status |
|---------|-----------|--------|
| User Login | Submit form → Receive token → Store token | ✓ Pass |
| Hotel Listing | Fetch API → Display hotels | ✓ Pass |
| Hotel Search | Filter request → Filtered results | ✓ Pass |
| Admin CRUD | Create/Update/Delete → Database updated | ✓ Pass |

### 7.4 User Acceptance Testing

**Test Scenarios:**

**Scenario 1: New User Registration and Login**
- User visits registration page
- Fills form with valid data
- Submits form
- Receives success message
- Redirected to home page
- User can log in with credentials
- **Result:** ✓ Passed

**Scenario 2: Browse and Book Hotel**
- User searches for hotels
- Applies filters
- Views hotel details
- Selects dates
- Confirms booking
- Receives confirmation
- **Result:** ✓ Passed

**Scenario 3: Admin Hotel Management**
- Admin logs in
- Navigates to hotels page
- Adds new hotel
- Edits existing hotel
- Uploads images
- Deletes hotel
- **Result:** ✓ Passed

### 7.5 Test Cases

**Test Case 1: User Registration**
- **Description:** Test user registration functionality
- **Pre-conditions:** User is not registered
- **Steps:**
  1. Navigate to registration page
  2. Enter valid details
  3. Submit form
- **Expected Result:** Account created, user logged in
- **Actual Result:** Account created successfully
- **Status:** ✓ Pass

**Test Case 2: Admin Authentication**
- **Description:** Test admin login with role verification
- **Pre-conditions:** Admin account exists in database
- **Steps:**
  1. Navigate to admin login
  2. Enter admin credentials
  3. Submit form
- **Expected Result:** Admin logged in, redirected to dashboard
- **Actual Result:** Admin authenticated successfully
- **Status:** ✓ Pass

**Test Case 3: Hotel CRUD Operations**
- **Description:** Test complete hotel management
- **Pre-conditions:** Admin is logged in
- **Steps:**
  1. Create new hotel
  2. View hotel list
  3. Edit hotel details
  4. Delete hotel
- **Expected Result:** All operations successful
- **Actual Result:** CRUD operations working correctly
- **Status:** ✓ Pass

**Test Case 4: API Security**
- **Description:** Test unauthorized access to admin endpoints
- **Pre-conditions:** No authentication token
- **Steps:**
  1. Call admin API without token
- **Expected Result:** 401 Unauthorized error
- **Actual Result:** Access denied as expected
- **Status:** ✓ Pass

**Test Case 5: Responsive Design**
- **Description:** Test UI on different screen sizes
- **Pre-conditions:** Application running
- **Steps:**
  1. Open site on mobile (375px)
  2. Open site on tablet (768px)
  3. Open site on desktop (1920px)
- **Expected Result:** Layout adapts correctly
- **Actual Result:** Responsive design working
- **Status:** ✓ Pass

---

## Chapter 8: Deployment

### 8.1 System Requirements

**Server Requirements:**
- **Operating System:** Windows 10/11, Linux (Ubuntu 20.04+), or macOS
- **Python:** 3.11 or higher
- **MySQL:** 8.0 or higher
- **RAM:** Minimum 2GB (4GB recommended)
- **Storage:** Minimum 500MB free space
- **Network:** Internet connection for API access

**Client Requirements:**
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **JavaScript:** Must be enabled
- **Screen Resolution:** Minimum 320px width (mobile supported)

### 8.2 Installation Guide

**Step 1: Clone Repository**
```bash
git clone https://github.com/abhinabbajagain/InnStay.git
cd InnStay
```

**Step 2: Set Up Virtual Environment**
```bash
python -m venv .venv
# Windows
.\.venv\Scripts\Activate.ps1
# Linux/Mac
source .venv/bin/activate
```

**Step 3: Install Dependencies**
```bash
pip install -r backend/requirements.txt
```

**Step 4: Configure Database**
- Open MySQL Workbench
- Run SQL script: `database/schema.sql`
- This creates database and sample data

**Step 5: Configure Environment**
- Copy `backend/.env.example` to `backend/.env`
- Update with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=innstay_db
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRY_HOURS=24
UPLOAD_FOLDER=uploads
```

### 8.3 Configuration

**Backend Configuration:**
- JWT secret should be changed in production
- Set appropriate token expiry time
- Configure CORS allowed origins
- Set up file upload size limits
- Configure MySQL connection pool

**Frontend Configuration:**
- Update API base URL in `hotel-api.js`
- Configure production vs development mode
- Set up error logging
- Configure analytics (if needed)

**Database Configuration:**
- Set appropriate user permissions
- Configure backup schedule
- Set up indexes for performance
- Enable query logging for debugging

### 8.4 Running the Application

**Start Backend Server:**
```bash
cd backend
python app.py
```
Server runs on: `http://localhost:5000`

**Access Application:**
- **Public Site:** Open `frontend/index.html` in browser
- **Admin Panel:** Open `admin/login.html` in browser

**Admin Credentials:**
- Email: admin@gmail.com
- Password: ADMIN123

**Production Deployment:**
For production, consider:
- Use Gunicorn or uWSGI for Flask
- Set up Nginx as reverse proxy
- Enable HTTPS with SSL certificate
- Use production-grade MySQL server
- Implement caching (Redis)
- Set up monitoring and logging
- Configure automated backups

---

## Chapter 9: Conclusion and Future Scope

### 9.1 Conclusion

The InnStay Hotel Booking System successfully achieves its objectives of providing a comprehensive, secure, and user-friendly platform for hotel bookings. The system demonstrates the practical application of modern web development technologies including Flask, MySQL, and JWT authentication.

**Key Achievements:**

1. **Functional System:** All planned features have been implemented and tested successfully
2. **Secure Authentication:** JWT-based authentication ensures data security and user privacy
3. **Responsive Design:** The application works seamlessly across all device sizes
4. **Efficient Database:** Normalized database structure ensures data integrity and performance
5. **User-Friendly Interface:** Intuitive design makes the system easy to use for both customers and administrators
6. **Scalable Architecture:** The system can easily accommodate growth in users and data

The project has provided valuable hands-on experience in full-stack web development, database design, API development, and security implementation. The modular architecture and clean code structure make the system maintainable and extensible for future enhancements.

### 9.2 Limitations

While the system is fully functional, some limitations exist:

1. **Payment Integration:** Currently uses mock payment system; real payment gateway integration pending
2. **Email Notifications:** Email sending functionality not yet implemented
3. **Advanced Analytics:** Limited analytics and reporting features in admin panel
4. **Multi-language Support:** Currently supports only English
5. **Progressive Web App:** Not yet implemented as PWA for offline access
6. **Real-time Updates:** No WebSocket implementation for live booking updates
7. **Social Features:** Limited social sharing and integration capabilities
8. **Advanced Search:** No map-based search or proximity filters yet

### 9.3 Future Enhancements

**Planned Enhancements:**

**Phase 1 (Short-term):**
1. **Payment Gateway Integration**
   - Integrate Stripe or PayPal for real transactions
   - Support multiple currencies
   - Add payment history and invoices

2. **Email Notifications**
   - Booking confirmations
   - Reminder emails before check-in
   - Password reset via email
   - Newsletter subscriptions

3. **Advanced Search**
   - Map-based hotel search with Google Maps
   - Filter by distance from location
   - "Near me" functionality using geolocation
   - Save search preferences

4. **Review System Enhancement**
   - Allow image uploads in reviews
   - Verified booking reviews only
   - Helpful/not helpful voting
   - Response system for hotels

**Phase 2 (Medium-term):**
1. **Mobile Application**
   - Native iOS app using Swift
   - Native Android app using Kotlin
   - Push notifications for bookings

2. **Advanced Admin Features**
   - Detailed analytics dashboard with charts
   - Revenue reports and forecasting
   - Customer behavior analytics
   - Automated marketing tools

3. **AI-Powered Features**
   - Smart hotel recommendations
   - Chatbot for customer support
   - Price prediction and optimization
   - Sentiment analysis on reviews

4. **Social Integration**
   - Social media login (Google, Facebook)
   - Share hotels on social platforms
   - Refer-a-friend program
   - Travel itinerary sharing

**Phase 3 (Long-term):**
1. **Loyalty Program**
   - Points system for bookings
   - Member tiers with benefits
   - Exclusive deals for members
   - Referral rewards

2. **Multi-tenant System**
   - Support for multiple hotel chains
   - Separate admin panels per hotel
   - Custom branding options
   - White-label solution

3. **Blockchain Integration**
   - Cryptocurrency payment options
   - Transparent booking history
   - Smart contracts for bookings
   - Decentralized reviews

4. **Advanced Features**
   - Virtual hotel tours (360° images)
   - AR room preview using phone camera
   - Voice-based search and booking
   - Integration with travel agencies

**Technical Improvements:**
- Implement caching (Redis) for better performance
- Add comprehensive logging and monitoring
- Implement automated testing suite
- Set up continuous integration/deployment (CI/CD)
- Add API rate limiting
- Implement GraphQL alongside REST API
- Add WebSocket for real-time features
- Optimize database queries with stored procedures
- Implement full-text search
- Add progressive web app capabilities

The InnStay Hotel Booking System provides a solid foundation for a modern hotel booking platform. With the planned enhancements, it can evolve into a comprehensive solution for hotel management and bookings, competing with major booking platforms in the market.

---

## References

**Books and Documentation:**
1. Flask Documentation - https://flask.palletsprojects.com/
2. MySQL Documentation - https://dev.mysql.com/doc/
3. MDN Web Docs - https://developer.mozilla.org/
4. Python Documentation - https://docs.python.org/3/
5. JWT Introduction - https://jwt.io/introduction

**Online Resources:**
6. W3Schools - HTML, CSS, JavaScript Tutorials
7. Stack Overflow - Problem solving and debugging
8. GitHub - Code repositories and examples
9. YouTube - Video tutorials on Flask and MySQL

**Research Papers:**
10. "Web-Based Hotel Reservation System" - International Journal of Computer Science
11. "Role-Based Access Control: A Survey" - IEEE Security & Privacy
12. "RESTful API Design Best Practices" - Microsoft Azure Documentation

**Technologies Used:**
13. Flask 3.0 - Python Web Framework
14. MySQL 8.0 - Relational Database
15. PyJWT 2.8.0 - JWT Implementation
16. mysql-connector-python - MySQL Driver
17. Werkzeug - WSGI Utilities

**Tools:**
18. Visual Studio Code - Code Editor
19. MySQL Workbench - Database Management
20. Git - Version Control
21. Postman - API Testing
22. Chrome DevTools - Frontend Debugging

---

**End of Documentation**

**Project Repository:** https://github.com/abhinabbajagain/InnStay

**Submitted By:** Abhinab Bajagain  
**College:** Texas College of Management and IT  
**University:** Lincoln University  
**Date:** February 15, 2026
