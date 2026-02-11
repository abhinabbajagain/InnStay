/* ============================================
   InnStay - Main JavaScript Module
   Description: Core functionality for InnStay
   ============================================ */

const InnStay = {
    /**
     * Initialize the application
     */
    init() {
        console.log('InnStay initialized');
        this.setupEventListeners();
        this.loadPopularHotels();
        this.setupMinimumDates();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const searchForm = document.getElementById('searchForm');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'pages/login.html';
            });
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = 'pages/register.html';
            });
        }
    },

    /**
     * Load popular hotels
     */
    loadPopularHotels() {
        const hotels = [
            {
                id: 1,
                name: 'Room in Khet Phra Nakhon',
                location: 'Bangkok, Thailand',
                price: 45,
                rating: 4.86,
                reviews: 127,
                image: 'https://via.placeholder.com/280x260/D4A5A5/FFFFFF?text=Bangkok+Room',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 2,
                name: 'Apartment in Sathon',
                location: 'Bangkok, Thailand',
                price: 72,
                rating: 4.94,
                reviews: 89,
                image: 'https://via.placeholder.com/280x260/A8D5BA/FFFFFF?text=Bangkok+Apt',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 3,
                name: 'Apartment in Khet Ratchathewi',
                location: 'Bangkok, Thailand',
                price: 86,
                rating: 4.95,
                reviews: 156,
                image: 'https://via.placeholder.com/280x260/F7DC6F/FFFFFF?text=Bangkok+Apt2',
                isFavorite: false,
                isGuestFavorite: false
            },
            {
                id: 4,
                name: 'Apartment in Khlong Toei',
                location: 'Bangkok, Thailand',
                price: 126,
                rating: 4.99,
                reviews: 203,
                image: 'https://via.placeholder.com/280x260/82E0AA/FFFFFF?text=Bangkok+Apt3',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 5,
                name: 'Apartment in Khet Ratchathewi',
                location: 'Bangkok, Thailand',
                price: 112,
                rating: 4.86,
                reviews: 94,
                image: 'https://via.placeholder.com/280x260/F8B88B/FFFFFF?text=Bangkok+Apt4',
                isFavorite: false,
                isGuestFavorite: false
            },
            {
                id: 6,
                name: 'Room in Khet Huai Kwang',
                location: 'Bangkok, Thailand',
                price: 41,
                rating: 4.96,
                reviews: 112,
                image: 'https://via.placeholder.com/280x260/F5B7B1/FFFFFF?text=Bangkok+Room2',
                isFavorite: false,
                isGuestFavorite: true
            }
        ];

        const container = document.getElementById('popularHotels');
        if (container) {
            container.innerHTML = hotels.map(hotel => this.createPropertyCard(hotel)).join('');
            this.attachCardListeners();
        }

        const container2 = document.getElementById('nextMonthHotels');
        if (container2) {
            container2.innerHTML = hotels.map(hotel => this.createPropertyCard(hotel)).join('');
            this.attachCardListeners();
        }

        const container3 = document.getElementById('tokyoHotels');
        if (container3) {
            container3.innerHTML = hotels.map(hotel => this.createPropertyCard(hotel)).join('');
            this.attachCardListeners();
        }
    },

    /**
     * Create property card HTML
     */
    createPropertyCard(hotel) {
        const stars = '★'.repeat(Math.floor(hotel.rating));
        const starHTML = `<span class="stars">${stars}</span>`;
        
        return `
            <div class="property-card" data-hotel-id="${hotel.id}">
                <div class="property-image-wrapper">
                    <img src="${hotel.image}" alt="${hotel.name}" class="property-image">
                    ${hotel.isGuestFavorite ? `<div class="property-badge-top-left">Guest favorite</div>` : ''}
                    <div class="property-badge-top-right" data-favorite-btn>
                        <i class="far fa-heart ${hotel.isFavorite ? 'favorited' : ''}"></i>
                    </div>
                </div>
                <div class="property-content">
                    <h3 class="property-name">${hotel.name}</h3>
                    <p class="property-location">${hotel.location}</p>
                    <div class="property-rating">
                        ${starHTML}
                        <span class="count">${hotel.rating}</span>
                        <span class="count">(${hotel.reviews})</span>
                    </div>
                    <p class="property-price">
                        <span class="amount">$${hotel.price}</span>
                        <span class="duration">for 2 nights</span>
                    </p>
                </div>
            </div>
        `;
    },

    /**
     * Attach event listeners to cards
     */
    attachCardListeners() {
        document.querySelectorAll('[data-favorite-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = btn.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('favorited');
            });
        });

        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', () => {
                window.location.href = 'pages/hotel-details.html';
            });
        });
    },

    /**
     * Handle search form submission
     */
    handleSearch(e) {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value;
        const checkin = document.getElementById('checkin').value;
        const guests = document.getElementById('guests').value;

        if (!destination || !checkin || !guests) {
            this.showAlert('Please fill in all search fields', 'warning');
            return;
        }

        // Store search params and redirect
        sessionStorage.setItem('search', JSON.stringify({
            destination,
            checkin,
            guests
        }));
        
        window.location.href = 'pages/search.html';
    },

    /**
     * Set minimum date to today
     */
    setupMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        if (checkinInput) {
            checkinInput.setAttribute('min', today);
        }
    },

    /**
     * Show alert message
     */
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.insertBefore(alertDiv, document.body.firstChild);

        setTimeout(() => alertDiv.remove(), 3000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => InnStay.init());