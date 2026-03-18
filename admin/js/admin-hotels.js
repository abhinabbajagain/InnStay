document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('hotelTableBody');
    const addBtn = document.getElementById('addHotelBtn');
    const modal = document.getElementById('hotelModal');
    const form = document.getElementById('hotelForm');
    const modalTitle = document.getElementById('hotelModalTitle');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    const searchInput = document.getElementById('hotelSearch');
    const statusFilter = document.getElementById('statusFilter');

    // Ensure user is authenticated
    ensureAuth();

    const state = {
        hotels: []
    };

    // Get data from AdminData
    const getAdminData = () => typeof AdminData !== 'undefined' ? AdminData.hotels || [] : [];

    const getFilteredHotels = () => {
        const query = (searchInput?.value || '').toLowerCase().trim();
        const status = statusFilter?.value || 'All';

        return state.hotels.filter(hotel => {
            const matchesQuery = !query ||
                hotel.title.toLowerCase().includes(query) ||
                hotel.location.toLowerCase().includes(query);
            const matchesStatus = status === 'All' || hotel.status === status;
            return matchesQuery && matchesStatus;
        });
    };

    const renderTable = () => {
        if (!tableBody) {
            return;
        }

        const hotels = getFilteredHotels();

        tableBody.innerHTML = hotels.map(hotel => `
            <tr data-id="${hotel.id}">
                <td>
                    <div class="hotel-cell">
                        <strong>${hotel.title}</strong>
                        <div class="muted">${hotel.description?.substring(0, 40) || 'Premium accommodation'}...</div>
                    </div>
                </td>
                <td>${hotel.location}</td>
                <td>${hotel.bedrooms || 2}</td>
                <td><div class="stars">${getStarRating(hotel.rating)}</div>${hotel.rating}</td>
                <td><span class="badge badge-${hotel.available ? 'success' : 'warning'}">${hotel.available ? 'Active' : 'Inactive'}</span></td>
                <td class="action-cells">
                    <button class="btn btn-sm btn-outline" data-action="edit">Edit</button>
                    <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    const openModal = (hotel = {}) => {
        if (!modal || !form || !modalTitle) {
            return;
        }

        modalTitle.textContent = hotel.id ? 'Edit Hotel' : 'Add Hotel';
        form.reset();
        form.hotelId.value = hotel.id || '';
        form.hotelName.value = hotel.title || '';
        form.hotelLocation.value = hotel.location || '';
        form.hotelPrice.value = hotel.price || '';
        form.hotelRating.value = hotel.rating || '';
        form.hotelReviews.value = hotel.reviews || '0';
        form.hotelStatus.value = hotel.available ? 'Active' : 'Inactive';
        form.hotelImage.value = hotel.image || '';
        form.hotelGallery.value = (hotel.gallery || []).join(', ');
        form.hotelAmenities.value = (hotel.amenities || []).join(', ');
        form.hotelBedrooms.value = hotel.bedrooms || '';
        form.hotelBeds.value = hotel.beds || '';
        form.hotelBathrooms.value = hotel.bathrooms || '';
        form.hotelGuests.value = hotel.maxGuests || '';
        form.hotelDescription.value = hotel.description || '';
        form.hostName.value = hotel.hostName || '';

        modal.classList.add('show');
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('show');
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            id: form.hotelId.value ? Number(form.hotelId.value) : Math.max(...state.hotels.map(h => h.id), 0) + 1,
            title: form.hotelName.value.trim(),
            location: form.hotelLocation.value.trim(),
            price: Number(form.hotelPrice.value),
            rating: Number(form.hotelRating.value),
            reviews: Number(form.hotelReviews.value),
            available: form.hotelStatus.value === 'Active',
            image: form.hotelImage.value.trim(),
            gallery: form.hotelGallery.value.split(',').map(item => item.trim()).filter(Boolean),
            amenities: form.hotelAmenities.value.split(',').map(item => item.trim()).filter(Boolean),
            bedrooms: Number(form.hotelBedrooms.value),
            beds: Number(form.hotelBeds.value),
            bathrooms: Number(form.hotelBathrooms.value),
            maxGuests: Number(form.hotelGuests.value),
            description: form.hotelDescription.value.trim(),
            hostName: form.hostName.value.trim()
        };

        try {
            // Update in AdminData
            if (typeof AdminData !== 'undefined') {
                const existingIndex = AdminData.hotels.findIndex(h => h.id === payload.id);
                if (existingIndex >= 0) {
                    AdminData.hotels[existingIndex] = payload;
                } else {
                    AdminData.hotels.push(payload);
                }
            }
            showNotification('Hotel saved successfully!', 'success');
            closeModal();
            refreshHotels();
        } catch (error) {
            showNotification('Failed to save hotel: ' + error.message, 'error');
            console.error('Failed to save hotel:', error);
        }
    };

    if (addBtn) {
        addBtn.addEventListener('click', () => openModal());
    }

    if (closeButtons.length) {
        closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const action = event.target.getAttribute('data-action');
            const row = event.target.closest('tr');
            const id = row?.getAttribute('data-id');

            if (!action || !id) {
                return;
            }

            if (action === 'edit') {
                const hotel = state.hotels.find(item => Number(item.id) === Number(id));
                if (hotel) {
                    openModal(deepClone(hotel));
                }
            }

            if (action === 'delete') {
                if (confirmDialog('Delete this hotel?')) {
                    try {
                        if (typeof AdminData !== 'undefined') {
                            AdminData.hotels = AdminData.hotels.filter(h => h.id !== Number(id));
                        }
                        showNotification('Hotel deleted successfully!', 'success');
                        refreshHotels();
                    } catch (error) {
                        showNotification('Failed to delete hotel', 'error');
                        console.error('Failed to delete hotel:', error);
                    }
                }
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', renderTable);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', renderTable);
    }

    const refreshHotels = () => {
        try {
            state.hotels = deepClone(getAdminData());
            renderTable();
        } catch (error) {
            console.error('Failed to load hotels:', error);
            state.hotels = [];
            renderTable();
        }
    };

    refreshHotels();
});
