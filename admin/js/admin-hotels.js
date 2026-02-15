document.addEventListener('DOMContentLoaded', function () {
    if (typeof HotelAPI === 'undefined') {
        return;
    }

    const tableBody = document.getElementById('hotelTableBody');
    const addBtn = document.getElementById('addHotelBtn');
    const modal = document.getElementById('hotelModal');
    const form = document.getElementById('hotelForm');
    const modalTitle = document.getElementById('hotelModalTitle');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    const searchInput = document.getElementById('hotelSearch');
    const statusFilter = document.getElementById('statusFilter');

    const state = {
        hotels: []
    };

    const getFilteredHotels = () => {
        const query = (searchInput?.value || '').toLowerCase().trim();
        const status = statusFilter?.value || 'All';

        return state.hotels.filter(hotel => {
            const matchesQuery = !query ||
                hotel.name.toLowerCase().includes(query) ||
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
        const placeholder = HotelAPI.placeholderImage;

        tableBody.innerHTML = hotels.map(hotel => `
            <tr data-id="${hotel.id}">
                <td>
                    <div class="hotel-cell">
                        <img src="${HotelAPI.getSafeImageUrl(hotel.image)}" data-fallback="${placeholder}" alt="${hotel.name}">
                        <div>
                            <strong>${hotel.name}</strong>
                            <div class="muted">${hotel.location}</div>
                        </div>
                    </div>
                </td>
                <td>${hotel.location}</td>
                <td>${hotel.beds}</td>
                <td>${hotel.rating.toFixed(1)}</td>
                <td><span class="badge badge-${hotel.status === 'Active' ? 'success' : hotel.status === 'Pending' ? 'warning' : 'danger'}">${hotel.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" data-action="edit">Edit</button>
                    <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
                </td>
            </tr>
        `).join('');

        attachImageFallbacks();
    };

    const attachImageFallbacks = () => {
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            if (img.dataset.bound === 'true') {
                return;
            }
            img.dataset.bound = 'true';
            img.addEventListener('error', () => {
                img.src = img.dataset.fallback;
            });
        });
    };

    const openModal = (hotel = {}) => {
        if (!modal || !form || !modalTitle) {
            return;
        }

        modalTitle.textContent = hotel.id ? 'Edit Hotel' : 'Add Hotel';
        form.reset();
        form.hotelId.value = hotel.id || '';
        form.hotelName.value = hotel.name || '';
        form.hotelLocation.value = hotel.location || '';
        form.hotelPrice.value = hotel.price || '';
        form.hotelRating.value = hotel.rating || '';
        form.hotelReviews.value = hotel.reviews || '';
        form.hotelStatus.value = hotel.status || 'Active';
        form.hotelImage.value = hotel.image || '';
        form.hotelGallery.value = (hotel.images || []).join(', ');
        form.hotelAmenities.value = (hotel.amenities || []).join(', ');
        form.hotelBedrooms.value = hotel.bedrooms || '';
        form.hotelBeds.value = hotel.beds || '';
        form.hotelBathrooms.value = hotel.bathrooms || '';
        form.hotelGuests.value = hotel.guests || '';
        form.hotelDescription.value = hotel.description || '';
        form.hostName.value = hotel.host?.name || '';

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
            id: form.hotelId.value ? Number(form.hotelId.value) : undefined,
            name: form.hotelName.value.trim(),
            location: form.hotelLocation.value.trim(),
            price: Number(form.hotelPrice.value),
            rating: Number(form.hotelRating.value),
            reviews: Number(form.hotelReviews.value),
            status: form.hotelStatus.value,
            image: form.hotelImage.value.trim(),
            images: form.hotelGallery.value.split(',').map(item => item.trim()).filter(Boolean),
            amenities: form.hotelAmenities.value.split(',').map(item => item.trim()).filter(Boolean),
            bedrooms: Number(form.hotelBedrooms.value),
            beds: Number(form.hotelBeds.value),
            bathrooms: Number(form.hotelBathrooms.value),
            guests: Number(form.hotelGuests.value),
            description: form.hotelDescription.value.trim(),
            hostName: form.hostName.value.trim()
        };
        try {
            if (payload.id) {
                await HotelAPI.updateHotel(payload.id, payload);
            } else {
                await HotelAPI.createHotel(payload);
            }
            closeModal();
            await refreshHotels();
        } catch (error) {
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
                    openModal(hotel);
                }
            }

            if (action === 'delete') {
                if (confirm('Delete this hotel?')) {
                    HotelAPI.deleteHotel(id).then(refreshHotels).catch(error => {
                        console.error('Failed to delete hotel:', error);
                    });
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

    const refreshHotels = async () => {
        try {
            state.hotels = await HotelAPI.listAdminHotels();
            renderTable();
        } catch (error) {
            console.error('Failed to load hotels:', error);
            state.hotels = [];
            renderTable();
        }
    };

    refreshHotels();
});
