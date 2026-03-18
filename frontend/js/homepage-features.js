/**
 * ============================================
 * InnStay - Homepage Features Enhancement
 * Description: Ensure all homepage features work properly
 * ============================================
 */

// Run after main.js loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        ensureAllFeaturesWork();
    }, 1000);
});

function ensureAllFeaturesWork() {
    console.log('✓ Ensuring all homepage features are working...');
    
    // 1. Ensure quick select buttons work
    ensureQuickSelectButtons();
    
    // 2. Ensure modals close properly when needed
    ensureModalsCloseOnEscape();
    
    // 3. Ensure nav pill updates
    ensureNavPillUpdates();
    
    // 4. Ensure calendar is generated
    ensureCalendarGeneration();
    
    // 5. Ensure destination list isrendered
    ensureDestinationList();
    
    // 6. Ensure favorites work
    ensureFavoritesWork();
    
    // 7. Ensure map initializes
    ensureMapInitialization();
    
    console.log('✓ All homepage features are ready!');
}

function ensureQuickSelectButtons() {
    const quickBtns = document.querySelectorAll('.quick-btn:not([data-listener="true"])');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const days = btn.getAttribute('data-days');
            if (typeof InnStay !== 'undefined' && InnStay.handleQuickDateSelect) {
                InnStay.handleQuickDateSelect(days);
                const datePickerModal = document.getElementById('datePickerModal');
                if (datePickerModal) {
                    datePickerModal.classList.remove('active');
                    setTimeout(() => {
                        document.getElementById('guestField')?.click();
                    }, 200);
                }
            }
        });
        btn.setAttribute('data-listener', 'true');
    });
}

function ensureModalsCloseOnEscape() {
    if (document.body.getAttribute('data-escape-listener') === 'true') return;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('datePickerModal')?.classList.remove('active');
            document.getElementById('wherePickerModal')?.classList.remove('active');
            document.getElementById('guestPickerModal')?.classList.remove('active');
            document.getElementById('mapViewModal')?.classList.remove('active');
        }
    });
    
    document.body.setAttribute('data-escape-listener', 'true');
}

function ensureNavPillUpdates() {
    const whereField = document.getElementById('whereField');
    const whenField = document.getElementById('whenField');
    const guestField = document.getElementById('guestField');
    
    const updatePill = () => {
        const destination = whereField?.getAttribute('data-destination') || 'Anywhere';
        const date = whenField?.getAttribute('data-date') || 'Any week';
        const guests = guestField?.getAttribute('data-guests') || 'Add guests';
        
        const nspWhere = document.getElementById('nspWhere');
        const nspWhen = document.getElementById('nspWhen');
        const nspGuests = document.getElementById('nspGuests');
        
        if (nspWhere) nspWhere.textContent = destination;
        if (nspWhen) nspWhen.textContent = date;
        if (nspGuests) nspGuests.textContent = guests;
    };
    
    // Initial update
    updatePill();
    
    // Update on field changes
    [whereField, whenField, guestField].forEach(field => {
        if (field && !field.getAttribute('data-pill-listener')) {
            field.addEventListener('click', () => {
                setTimeout(updatePill, 300);
            });
            field.setAttribute('data-pill-listener', 'true');
        }
    });
}

function ensureCalendarGeneration() {
    const datePickerModal = document.getElementById('datePickerModal');
    if (!datePickerModal) return;
    
    datePickerModal.addEventListener('click', () => {
        setTimeout(() => {
            if (typeof InnStay !== 'undefined' && InnStay.generateCalendars) {
                const calendar1 = document.getElementById('calendar1');
                const calendar2 = document.getElementById('calendar2');
                
                // Check if calendars are empty
                if (!calendar1 || !calendar2 || calendar1.children.length === 0) {
                    InnStay.generateCalendars();
                }
            }
        }, 100);
    }, { once: true });
}

function ensureDestinationList() {
    const whereField = document.getElementById('whereField');
    if (!whereField) return;
    
    whereField.addEventListener('click', () => {
        setTimeout(() => {
            if (typeof InnStay !== 'undefined' && InnStay.renderDestinations) {
                const destinationsList = document.getElementById('destinationsList');
                
                // Check if list is empty
                if (!destinationsList || destinationsList.children.length === 0) {
                    if (InnStay.destinations) {
                        InnStay.renderDestinations(InnStay.destinations);
                    }
                }
            }
        }, 100);
    }, { once: true });
}

function ensureFavoritesWork() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    document.querySelectorAll('[data-favorite-btn]').forEach(btn => {
        const card = btn.closest('.property-card');
        const hotelId = card?.getAttribute('data-hotel-id');
        
        if (hotelId && favorites.includes(hotelId)) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
        
        if (!btn.getAttribute('data-favorite-listener')) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                    
                    // Update localStorage
                    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
                    const idx = favs.indexOf(hotelId);
                    
                    if (icon.classList.contains('fas')) {
                        if (idx === -1) favs.push(hotelId);
                    } else {
                        if (idx > -1) favs.splice(idx, 1);
                    }
                    
                    localStorage.setItem('favorites', JSON.stringify(favs));
                }
            });
            btn.setAttribute('data-favorite-listener', 'true');
        }
    });
}

function ensureMapInitialization() {
    const mapView = document.getElementById('mapViewModal');
    if (!mapView) return;
    
    mapView.addEventListener('click', (e) => {
        if (mapView.classList.contains('active')) {
            setTimeout(() => {
                const mapContainer = document.getElementById('mapContainer');
                if (mapContainer && (!mapContainer.children.length || !window.L)) {
                    if (typeof InnStay !== 'undefined' && InnStay.initializeMap) {
                        InnStay.initializeMap();
                    }
                }
            }, 100);
        }
    }, true);
}

// Export for console debugging
window.HomepageFeatures = {
    ensureAllFeaturesWork,
    ensureQuickSelectButtons,
    ensureModalsCloseOnEscape,
    ensureNavPillUpdates,
    ensureCalendarGeneration,
    ensureDestinationList,
    ensureFavoritesWork,
    ensureMapInitialization
};
