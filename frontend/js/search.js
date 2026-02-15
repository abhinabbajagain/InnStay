document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('hotelResults');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const sortDropdown = document.getElementById('sortDropdown');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const resultsCount = document.getElementById('resultsCount');

    const state = {
        hotels: []
    };

    const updatePriceLabel = () => {
        if (priceRange && priceValue) {
            priceValue.textContent = priceRange.value;
        }
    };

    const getSelectedStars = () =>
        Array.from(document.querySelectorAll('input[id^="star"]:checked')).map(cb => Number(cb.value));

    const getSelectedAmenities = () =>
        Array.from(document.querySelectorAll('[data-filter="amenities"] input:checked')).map(cb => cb.value);

    const applyFilters = () => {
        const maxPrice = Number(priceRange?.value || 500);
        const selectedStars = getSelectedStars();
        const selectedAmenities = getSelectedAmenities();

        let filtered = [...state.hotels];

        filtered = filtered.filter(hotel => Number(hotel.price) <= maxPrice);

        if (selectedStars.length) {
            filtered = filtered.filter(hotel => selectedStars.some(star => hotel.rating >= star));
        }

        if (selectedAmenities.length) {
            filtered = filtered.filter(hotel =>
                selectedAmenities.every(amenity =>
                    (hotel.amenities || []).map(item => item.toLowerCase()).includes(amenity)
                )
            );
        }

        renderResults(filtered);
    };

    const sortResults = (value) => {
        let sorted = [...state.hotels];

        if (value === 'price-low') {
            sorted.sort((a, b) => a.price - b.price);
        }
        if (value === 'price-high') {
            sorted.sort((a, b) => b.price - a.price);
        }
        if (value === 'rating') {
            sorted.sort((a, b) => b.rating - a.rating);
        }

        renderResults(sorted);
    };

    const renderResults = (hotels) => {
        if (!resultsContainer) {
            return;
        }

        const placeholder = typeof HotelAPI !== 'undefined' ? HotelAPI.placeholderImage : '';
        const html = hotels.map(hotel => {
            const image = typeof HotelAPI !== 'undefined'
                ? HotelAPI.getSafeImageUrl(hotel.image)
                : hotel.image;

            return `
                <div class="hotel-result" data-hotel-id="${hotel.id}">
                    <img src="${image}" data-fallback="${placeholder}" alt="${hotel.name}" class="hotel-result-image">
                    <div class="hotel-result-content">
                        <div class="hotel-result-header">
                            <div>
                                <div class="hotel-result-name">${hotel.name}</div>
                                <p class="hotel-result-location">
                                    <i class="fas fa-map-marker-alt"></i> ${hotel.location}
                                </p>
                            </div>
                            <div class="text-end">
                                <div class="hotel-result-price">$${hotel.price}</div>
                                <span class="hotel-result-price-label">per night</span>
                            </div>
                        </div>
                        <div class="hotel-result-rating">
                            ${typeof InnStay !== 'undefined' ? InnStay.createStarRating(hotel.rating) : ''}
                            <span class="ms-2">${hotel.rating} (${hotel.reviews} reviews)</span>
                        </div>
                        <div class="hotel-result-amenities">
                            ${(hotel.amenities || []).slice(0, 4).map(a => `<span class="amenity-badge">${a}</span>`).join('')}
                        </div>
                        <div class="hotel-result-footer">
                            <button class="btn btn-primary" data-action="view-details">View Details</button>
                            <button class="btn btn-outline-primary" type="button">
                                <i class="fas fa-heart"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = html || '<div class="no-results"><i class="fas fa-search"></i><p>No hotels found</p></div>';

        if (resultsCount) {
            resultsCount.textContent = `Showing ${hotels.length} hotels`;
        }

        if (typeof InnStay !== 'undefined' && typeof InnStay.attachImageFallbacks === 'function') {
            InnStay.attachImageFallbacks();
        }
    };

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => sortResults(e.target.value));
    }

    if (priceRange) {
        priceRange.addEventListener('input', updatePriceLabel);
    }

    if (resultsContainer) {
        resultsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action="view-details"]');
            if (!button) {
                return;
            }
            const card = e.target.closest('.hotel-result');
            const hotelId = card?.getAttribute('data-hotel-id');
            if (hotelId) {
                window.location.href = `hotel-details.html?id=${hotelId}`;
            }
        });
    }

    const loadHotels = async () => {
        if (typeof HotelAPI === 'undefined') {
            renderResults([]);
            return;
        }
        try {
            state.hotels = await HotelAPI.listHotels();
            renderResults(state.hotels);
        } catch (error) {
            console.warn('Failed to load hotels:', error);
            renderResults([]);
        }
    };

    updatePriceLabel();
    loadHotels();
});
