/*
 * ============================================
 * InnStay - Main JavaScript
 * Description: Core functionality for InnStay application
 * ============================================
 */

const InnStay = {
    config: {
        apiUrl: 'http://localhost:5000/api',
        appName: 'InnStay',
        appVersion: '1.0.0'
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing InnStay application...');
        this.setupEventListeners();
        this.setMinimumDates();
        this.loadPopularHotels();
        console.log('✓ Application initialized');
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.navigateTo('pages/login.html'));
        }
    },

    /**
     * Handle hotel search
     * @param {Event} event - Form submission event
     */
    handleSearch(event) {
        event.preventDefault();

        const location = document.getElementById('location').value.trim();
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;

        if (!location || !checkIn || !checkOut || !guests) {
            this.showAlert('Please fill in all search fields', 'warning');
            return;
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            this.showAlert('Check-out date must be after check-in date', 'danger');
            return;
        }

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
     * Load popular hotels
     */
    loadPopularHotels() {
        const container = document.getElementById('popularHotelsContainer');
        if (!container) return;

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

        const hotelHTML = hotels.map(hotel => this.createHotelCard(hotel)).join('');
        container.innerHTML = hotelHTML;
    },

    /**
     * Create HTML card for a hotel
     * @param {Object} hotel - Hotel data
     * @returns {String} HTML string
     */
    createHotelCard(hotel) {
        return `
            <div>
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
     * @returns {String} HTML with stars
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
     * View hotel details
     * @param {Number} hotelId - Hotel ID
     */
    viewHotelDetails(hotelId) {
        window.location.href = `pages/hotel-details.html?id=${hotelId}`;
    },

    /**
     * Show alert notification
     * @param {String} message - Alert message
     * @param {String} type - Alert type
     * @param {Number} duration - Duration in ms
     */
    showAlert(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `${message}`;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        } else {
            document.body.insertBefore(alertDiv, document.body.firstChild);
        }

        setTimeout(() => {
            alertDiv.remove();
        }, duration);
    },

    /**
     * Navigate to a page
     * @param {String} path - Page path
     */
    navigateTo(path) {
        window.location.href = path;
    }
};

/**
 * Initialize when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    InnStay.init();
});

console.log('InnStay main.js loaded');
