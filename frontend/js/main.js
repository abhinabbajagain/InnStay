/*
 * ============================================
 * InnStay - Main JavaScript
 * Author: InnStay Team
 * Description: Core functionality and utilities for InnStay application
 * ============================================
 */

/**
 * InnStay Application Object
 * Contains all main application methods and utilities
 * @namespace InnStay
 */
const InnStay = {
    /**
     * Configuration object for the application
     * Contains API endpoints and application settings
     */
    config: {
        apiUrl: 'http://localhost:5000/api',
        appName: 'InnStay',
        appVersion: '1.0.0'
    },

    /**
     * Initialize the application
     * Called when the DOM is fully loaded
     * Sets up event listeners and initializes components
     */
    init() {
        console.log('Initializing InnStay application...');
        this.setupEventListeners();
        this.setMinimumDates();
        this.loadPopularHotels();
        console.log('✓ Application initialized successfully');
    },

    /**
     * Set up event listeners for form submissions and interactions
     * Attaches click and submit handlers to relevant elements
     */
    setupEventListeners() {
        // Handle search form submission
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Handle login button click (if exists)
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.navigateTo('pages/login.html'));
        }
    },

    /**
     * Handle hotel search form submission
     * Validates form data and redirects to search results page
     * @param {Event} event - The form submission event
     */
    handleSearch(event) {
        event.preventDefault();

        // Get form values
        const location = document.getElementById('location').value.trim();
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;

        // Validate inputs
        if (!location || !checkIn || !checkOut || !guests) {
            this.showAlert('Please fill in all search fields', 'warning');
            return;
        }

        // Validate dates
        if (new Date(checkIn) >= new Date(checkOut)) {
            this.showAlert('Check-out date must be after check-in date', 'danger');
            return;
        }

        // Build query string and redirect
        const queryParams = new URLSearchParams({
            location,
            checkIn,
            checkOut,
            guests
        });

        window.location.href = `pages/search.html?${queryParams.toString()}`;
    },

    /**
     * Set minimum dates for date inputs
     * Prevents users from selecting past dates
     */
    setMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');

        if (checkInInput) {
            checkInInput.setAttribute('min', today);
            checkInInput.addEventListener('change', () => {
                const checkInDate = checkInInput.value;
                if (checkOutInput) {
                    checkOutInput.setAttribute('min', checkInDate);
                }
            });
        }
    },

    /**
     * Load and display popular hotels on the home page
     * Simulates loading from backend API
     */
    loadPopularHotels() {
        const container = document.getElementById('popularHotelsContainer');
        if (!container) return;

        // Mock data - would come from backend API
        const hotels = [
            {
                id: 1,
                name: 'Luxury Palace Hotel',
                location: 'New York, USA',
                price: 250,
                rating: 4.8,
                reviews: 245,
                image: 'https://via.placeholder.com/300x200?text=Luxury+Palace'
            },
            {
                id: 2,
                name: 'Beach Resort Paradise',
                location: 'Miami, USA',
                price: 180,
                rating: 4.6,
                reviews: 189,
                image: 'https://via.placeholder.com/300x200?text=Beach+Resort'
            },
            {
                id: 3,
                name: 'Mountain View Lodge',
                location: 'Denver, USA',
                price: 120,
                rating: 4.5,
                reviews: 156,
                image: 'https://via.placeholder.com/300x200?text=Mountain+View'
            }
        ];

        // Generate HTML for each hotel and insert into DOM
        const hotelHTML = hotels.map(hotel => this.createHotelCard(hotel)).join('');
        container.innerHTML = hotelHTML;
    },

    /**
     * Create an HTML card element for a hotel
     * @param {Object} hotel - Hotel data object
     * @returns {String} HTML string for the hotel card
     */
    createHotelCard(hotel) {
        return `
            <div class="col-md-4 mb-4">
                <div class="hotel-card">
                    <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
                    <div class="hotel-content">
                        <h5 class="hotel-name">${hotel.name}</h5>
                        <p class="hotel-location">
                            <i class="fas fa-map-marker-alt"></i> ${hotel.location}
                        </p>
                        <div class="hotel-rating">
                            ${this.createStarRating(hotel.rating)} 
                            (${hotel.reviews} reviews)
                        </div>
                        <p class="hotel-price">$${hotel.price}/night</p>
                        <button class="btn btn-primary w-100" 
                                onclick="InnStay.viewHotelDetails(${hotel.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create star rating HTML
     * @param {Number} rating - Numerical rating (0-5)
     * @returns {String} HTML with star elements
     */
    createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star"><i class="fas fa-star"></i></span>';
            } else if (i - 0.5 <= rating) {
                stars += '<span class="star"><i class="fas fa-star-half-alt"></i></span>';
            } else {
                stars += '<span class="star"><i class="far fa-star"></i></span>';
            }
        }
        return stars;
    },

    /**
     * Navigate to hotel details page
     * @param {Number} hotelId - The hotel's ID
     */
    viewHotelDetails(hotelId) {
        window.location.href = `pages/hotel-details.html?id=${hotelId}`;
    },

    /**
     * Display an alert notification to the user
     * @param {String} message - The alert message
     * @param {String} type - Alert type: 'success', 'danger', 'warning', 'info'
     * @param {Number} duration - Duration to show alert in milliseconds (default: 5000)
     */
    showAlert(message, type = 'info', duration = 5000) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insert at top of page
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        } else {
            document.body.insertBefore(alertDiv, document.body.firstChild);
        }

        // Auto-dismiss after duration
        setTimeout(() => {
            alertDiv.remove();
        }, duration);
    },

    /**
     * Navigate to a specific page
     * @param {String} path - The path to navigate to
     */
    navigateTo(path) {
        window.location.href = path;
    },

    /**
     * Format a date string to readable format
     * @param {String} dateString - Date in YYYY-MM-DD format
     * @returns {String} Formatted date (e.g., "January 15, 2024")
     */
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    /**
     * Calculate number of nights between two dates
     * @param {String} checkIn - Check-in date (YYYY-MM-DD)
     * @param {String} checkOut - Check-out date (YYYY-MM-DD)
     * @returns {Number} Number of nights
     */
    calculateNights(checkIn, checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = checkOutDate - checkInDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Format currency value
     * @param {Number} value - The amount to format
     * @param {String} currency - Currency code (default: 'USD')
     * @returns {String} Formatted currency string
     */
    formatCurrency(value, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(value);
    }
};

/**
 * Initialize the application when DOM is ready
 * Ensures all HTML elements are loaded before executing JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    InnStay.init();
});

// Log that script has loaded
console.log('InnStay main.js loaded successfully');
