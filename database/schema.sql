/*
 ============================================
 InnStay - Hotel Booking System
 Database Schema (MySQL)
 Author: InnStay Team
 Date: February 2026
 Description: Complete database structure for hotel booking system
 ============================================
*/

-- Create Database
CREATE DATABASE IF NOT EXISTS innstay_db;
USE innstay_db;

-- ============================================
-- 1. USERS TABLE
-- Description: Stores user account information
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(10),
    profile_image VARCHAR(255),
    role ENUM('user', 'admin', 'manager') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. HOTELS TABLE
-- Description: Stores hotel information
-- ============================================
CREATE TABLE hotels (
    hotel_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(255),
    star_rating INT DEFAULT 3,
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    manager_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id),
    INDEX idx_city (city),
    INDEX idx_country (country),
    INDEX idx_star_rating (star_rating),
    INDEX idx_manager (manager_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. ROOMS TABLE
-- Description: Stores room type information
-- ============================================
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    room_type ENUM('single', 'double', 'suite', 'deluxe') DEFAULT 'double',
    capacity INT DEFAULT 2,
    price_per_night DECIMAL(10, 2) NOT NULL,
    description TEXT,
    amenities JSON,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    UNIQUE KEY unique_room (hotel_id, room_number),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_room_type (room_type),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. BOOKINGS TABLE
-- Description: Stores booking information
-- ============================================
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_nights INT GENERATED ALWAYS AS (DATEDIFF(check_out_date, check_in_date)) STORED,
    number_of_guests INT DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    special_requests TEXT,
    payment_id INT,
    confirmation_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_status (status),
    INDEX idx_check_in (check_in_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. REVIEWS TABLE
-- Description: Stores hotel and booking reviews
-- ============================================
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    hotel_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    cleanliness_rating INT,
    service_rating INT,
    value_rating INT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. PAYMENTS TABLE
-- Description: Stores payment transaction information
-- ============================================
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. AMENITIES TABLE
-- Description: Stores available amenities
-- ============================================
CREATE TABLE amenities (
    amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 8. HOTEL_AMENITIES JUNCTION TABLE
-- Description: Links hotels with their amenities (Many-to-Many)
-- ============================================
CREATE TABLE hotel_amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    amenity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id),
    UNIQUE KEY unique_hotel_amenity (hotel_id, amenity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 9. FAVORITES TABLE
-- Description: Stores user's favorite hotels
-- ============================================
CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_hotel (user_id, hotel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 10. NOTIFICATIONS TABLE
-- Description: Stores user notifications
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('booking_confirmation', 'booking_reminder', 'payment_confirmation', 'review_request', 'promotional') DEFAULT 'promotional',
    title VARCHAR(150),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    related_booking_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample users
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@innstay.com', 'admin123', '5551234567', 'admin'),
('John Doe', 'john@example.com', 'password123', '5559876543', 'user'),
('Jane Smith', 'jane@example.com', 'password456', '5558765432', 'user');

-- Insert sample hotels
INSERT INTO hotels (name, address, city, country, phone, star_rating, manager_id) VALUES
('Luxury Palace Hotel', '123 Main St', 'New York', 'USA', '5551234567', 5, 1),
('Beach Resort Paradise', '456 Ocean Ave', 'Miami', 'USA', '5559876543', 4, 1);

-- Insert sample rooms
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, amenities) VALUES
(1, '101', 'single', 1, 150.00, '["WiFi", "TV", "AC"]'),
(1, '102', 'double', 2, 250.00, '["WiFi", "TV", "AC", "Balcony"]'),
(2, '201', 'suite', 4, 350.00, '["WiFi", "TV", "AC", "Kitchen", "Pool"]');

-- Insert amenities
INSERT INTO amenities (name, description, icon) VALUES
('WiFi', 'High-speed internet', 'fas fa-wifi'),
('Pool', 'Swimming pool', 'fas fa-swimming-pool'),
('Gym', 'Fitness center', 'fas fa-dumbbell'),
('Parking', 'Free parking', 'fas fa-square-parking'),
('Restaurant', 'On-site restaurant', 'fas fa-utensils'),
('Spa', 'Spa and wellness', 'fas fa-spa');

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get available rooms for a specific date range
-- SELECT r.* FROM rooms r 
-- WHERE r.hotel_id = 1 AND r.room_id NOT IN 
-- (SELECT room_id FROM bookings WHERE check_in_date <= '2026-02-15' AND check_out_date >= '2026-02-10');

-- Get all bookings for a user
-- SELECT * FROM bookings WHERE user_id = 2 ORDER BY created_at DESC;

-- Get average rating for a hotel
-- SELECT hotel_id, AVG(rating) as avg_rating, COUNT(*) as total_reviews 
-- FROM reviews GROUP BY hotel_id;

-- Get booking revenue by hotel
-- SELECT hotel_id, SUM(total_price) as total_revenue FROM bookings 
-- WHERE status = 'completed' GROUP BY hotel_id;
