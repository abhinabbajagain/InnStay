/* ============================================
   InnStay - Main JavaScript Module
   Description: Core functionality for InnStay
   ============================================ */

const InnStay = {
    // Configuration
    config: {
        apiUrl: 'http://localhost:5000/api'
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('InnStay initialized');
        this.setupEventListeners();
        this.setupScrollListener();
        this.updateAuthUI();
        this.loadPopularHotels();
        this.setupMinimumDates();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const searchForm = document.getElementById('searchForm');
        const expandSearchBtn = document.getElementById('expandSearchBtn');
        const menuBtn = document.getElementById('menuBtn');
        const menuDropdown = document.getElementById('menuDropdown');

        // Search form
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Expand search button - open map view
        if (expandSearchBtn) {
            expandSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSearch(e);
            });
        }

        // Navigation links
        document.querySelectorAll('.navbar-center .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Remove active class from all nav links
                    document.querySelectorAll('.navbar-center .nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Menu button
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                menuDropdown.classList.toggle('show');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar-right') && !e.target.closest('.menu-dropdown')) {
                    menuDropdown.classList.remove('show');
                }
            });
        }

        // Date picker
        this.setupDatePicker();

        // Guest picker
        this.setupGuestPicker();

        // Where picker
        this.setupWherePicker();
        
        // Map view close button
        const mapCloseBtn = document.getElementById('mapCloseBtn');
        if (mapCloseBtn) {
            mapCloseBtn.addEventListener('click', () => {
                const mapViewModal = document.getElementById('mapViewModal');
                if (mapViewModal) {
                    mapViewModal.classList.remove('active');
                    document.body.style.overflow = 'auto'; // Re-enable scrolling
                }
            });
        }
        
        // Close map modal when clicking outside
        const mapViewModal = document.getElementById('mapViewModal');
        if (mapViewModal) {
            mapViewModal.addEventListener('click', (e) => {
                if (e.target === mapViewModal) {
                    mapViewModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Map search field interactions
        const mapLocationField = document.querySelector('[id="mapLocation"]')?.parentElement;
        const mapDatesField = document.querySelector('[id="mapDates"]')?.parentElement;
        const mapGuestsField = document.querySelector('[id="mapGuests"]')?.parentElement;
        
        // Click map location to open where picker
        if (mapLocationField) {
            mapLocationField.addEventListener('click', (e) => {
                e.stopPropagation();
                const wherePickerModal = document.getElementById('wherePickerModal');
                if (wherePickerModal) {
                    document.getElementById('datePickerModal')?.classList.remove('active');
                    document.getElementById('guestPickerModal')?.classList.remove('active');
                    wherePickerModal.classList.add('active');
                    document.getElementById('destinationSearch').focus();
                }
            });
        }
        
        // Click map dates to open date picker
        if (mapDatesField) {
            mapDatesField.addEventListener('click', (e) => {
                e.stopPropagation();
                const datePickerModal = document.getElementById('datePickerModal');
                if (datePickerModal) {
                    document.getElementById('wherePickerModal')?.classList.remove('active');
                    document.getElementById('guestPickerModal')?.classList.remove('active');
                    datePickerModal.classList.add('active');
                }
            });
        }
        
        // Click map guests to open guest picker
        if (mapGuestsField) {
            mapGuestsField.addEventListener('click', (e) => {
                e.stopPropagation();
                const guestPickerModal = document.getElementById('guestPickerModal');
                if (guestPickerModal) {
                    document.getElementById('wherePickerModal')?.classList.remove('active');
                    document.getElementById('datePickerModal')?.classList.remove('active');
                    guestPickerModal.classList.add('active');
                }
            });
        }
    },

    /**
     * Setup date picker modal
     */
    setupDatePicker() {
        const whenField = document.getElementById('whenField');
        const datePickerModal = document.getElementById('datePickerModal');
        const dateTabs = document.querySelectorAll('.date-tab');
        const quickBtns = document.querySelectorAll('.quick-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const monthRangeInput = document.getElementById('monthRange');
        const flexBtns = document.querySelectorAll('.flex-btn');

        // Open date picker on click
        if (whenField) {
            whenField.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other modals
                document.getElementById('wherePickerModal')?.classList.remove('active');
                document.getElementById('guestPickerModal')?.classList.remove('active');
                datePickerModal.classList.add('active');
                this.generateCalendars();
                this.generateFlexibleMonths();
            });
        }

        // Close date picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#datePickerModal') && !e.target.closest('#whenField')) {
                datePickerModal.classList.remove('active');
            }
        });

        // Anytime button
        const anytimeBtn = document.getElementById('anytimeBtn');
        if (anytimeBtn) {
            anytimeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                whenField.setAttribute('data-date', 'Anytime');
                document.getElementById('mapDates').textContent = 'Anytime';
                document.getElementById('checkin').value = '';
                datePickerModal.classList.remove('active');
            });
        }

        // Tab switching with content
        dateTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update active tab
                dateTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-tab') === tabName) {
                        content.classList.add('active');
                    }
                });

                // Initialize content if needed
                if (tabName === 'flexible') {
                    this.generateFlexibleMonths();
                }
            });
        });

        // Month range slider
        if (monthRangeInput) {
            const updateMonthDisplay = (months) => {
                document.getElementById('monthCount').textContent = months;
                
                // Calculate dates starting from today with the selected duration
                const today = new Date();
                const startDate = new Date(today);
                const endDate = new Date(today);
                endDate.setMonth(endDate.getMonth() + months);
                
                // Format dates as "Mon DD to Mon DD"
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const startStr = monthNames[startDate.getMonth()] + ' ' + startDate.getDate();
                const endStr = monthNames[endDate.getMonth()] + ' ' + endDate.getDate();
                
                document.getElementById('monthDateStart').textContent = startStr;
                document.getElementById('monthDateEnd').textContent = endStr;
                
                // Visual feedback - update slider position
                const percentage = (months / 12) * 100;
                monthRangeInput.style.setProperty('--slider-percent', percentage + '%');
            };

            // Update on input (while dragging)
            monthRangeInput.addEventListener('input', (e) => {
                const months = parseInt(e.target.value);
                updateMonthDisplay(months);
            });

            // Initial display on load
            const initialMonths = parseInt(monthRangeInput?.value || '1');
            updateMonthDisplay(initialMonths);
        }

        // Flexible duration buttons
        flexBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                flexBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Quick select buttons
        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const days = btn.getAttribute('data-days');
                this.handleQuickDateSelect(days);
                datePickerModal.classList.remove('active');
                
                // Auto-redirect to guest field
                setTimeout(() => {
                    document.getElementById('guestField').click();
                }, 200);
            });
        });
    },

    /**
     * Generate calendar for two months
     */
    generateCalendars() {
        const today = new Date();
        const month1 = today.getMonth();
        const month2 = (today.getMonth() + 1) % 12;
        const year1 = today.getFullYear();
        const year2 = month2 === 0 ? year1 + 1 : year1;

        this.renderCalendar(month1, year1, 'calendar1');
        this.renderCalendar(month2, year2, 'calendar2');
    },

    /**
     * Render calendar for a specific month
     */
    renderCalendar(month, year, elementId) {
        const calendar = document.getElementById(elementId);
        const monthYear = document.getElementById(elementId === 'calendar1' ? 'monthYear1' : 'monthYear2');
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        
        monthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Add day names header
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = '600';
            dayHeader.style.color = '#717171';
            dayHeader.style.fontSize = '0.85rem';
            dayHeader.style.padding = '8px';
            calendar.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const btn = document.createElement('button');
            btn.textContent = daysInPrevMonth - i;
            btn.className = 'calendar-day other-month';
            calendar.appendChild(btn);
        }
        
        // Add current month's days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const btn = document.createElement('button');
            btn.textContent = day;
            btn.className = 'calendar-day';
            
            // Highlight today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                btn.classList.add('today');
            }
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedDate = new Date(year, month, day);
                const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                document.getElementById('checkin').value = selectedDate.toISOString().split('T')[0];
                document.getElementById('whenField').setAttribute('data-date', formattedDate);
                document.getElementById('mapDates').textContent = formattedDate;
                document.getElementById('datePickerModal').classList.remove('active');
                
                // Auto-redirect to guest field
                setTimeout(() => {
                    document.getElementById('guestField').click();
                }, 200);
            });
            
            calendar.appendChild(btn);
        }
        
        // Add next month's days
        const totalCells = calendar.children.length - dayNames.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const btn = document.createElement('button');
            btn.textContent = day;
            btn.className = 'calendar-day other-month';
            calendar.appendChild(btn);
        }
    },

    /**
     * Handle quick date selection
     */
    handleQuickDateSelect(days) {
        const checkinInput = document.getElementById('checkin');
        const whenField = document.getElementById('whenField');
        const today = new Date();
        
        if (days === 'exact') {
            // Just set today's date
            checkinInput.value = today.toISOString().split('T')[0];
            const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            whenField.setAttribute('data-date', formattedDate);
        } else {
            // Add days to today
            const daysToAdd = parseInt(days);
            const selectedDate = new Date(today);
            selectedDate.setDate(selectedDate.getDate() + daysToAdd);
            checkinInput.value = selectedDate.toISOString().split('T')[0];
            const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            whenField.setAttribute('data-date', formattedDate);
        }
    },

    /**
     * Generate flexible months grid
     */
    generateFlexibleMonths() {
        const grid = document.getElementById('flexMonthsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const today = new Date();
        
        // Generate months from now through July 2027
        for (let i = 0; i < 18; i++) {
            const date = new Date(today);
            date.setMonth(date.getMonth() + i);
            
            const card = document.createElement('button');
            card.className = 'flex-month-card';
            card.innerHTML = `
                <div class="flex-month-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="flex-month-name">${monthNames[date.getMonth()]}</div>
                <div class="flex-month-year">${date.getFullYear()}</div>
            `;
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                document.getElementById('checkin').value = date.toISOString().split('T')[0];
                document.getElementById('whenField').setAttribute('data-date', formattedDate);
                document.getElementById('datePickerModal').classList.remove('active');
                
                // Auto-redirect to guest field
                setTimeout(() => {
                    document.getElementById('guestField').click();
                }, 200);
            });
            
            grid.appendChild(card);
        }

        // Setup swipe and navigation for flexible months
        this.setupFlexibleMonthsSwipe();
    },

    /**
     * Setup swipe and navigation for flexible months grid
     */
    setupFlexibleMonthsSwipe() {
        const grid = document.getElementById('flexMonthsGrid');
        const navBtn = document.getElementById('flexNavBtn');
        let startX = 0;
        let startTime = 0;

        // Swipe detection on touch
        grid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
        });

        grid.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endTime = Date.now();
            const distance = startX - endX;
            const time = endTime - startTime;
            const isSwipe = Math.abs(distance) > 50 && time < 500;

            if (isSwipe && distance > 0) {
                // Swiped left - scroll right
                grid.scrollLeft += 400;
            } else if (isSwipe && distance < 0) {
                // Swiped right - scroll left
                grid.scrollLeft -= 400;
            }
        });

        // Right arrow button click
        if (navBtn) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                grid.scrollLeft += 400;
            });
        }
    },

    /**
     * Setup where picker modal
     */
    setupWherePicker() {
        const whereField = document.getElementById('whereField');
        const wherePickerModal = document.getElementById('wherePickerModal');
        const destinationsList = document.getElementById('destinationsList');
        const destinationSearch = document.getElementById('destinationSearch');

        // Destination data
        this.destinations = [
            {
                name: 'Nearby',
                description: "Find what's around you",
                icon: '✈️'
            },
            {
                name: 'Bangkok, Thailand',
                description: 'For sights like Grand Palace',
                icon: '🏰'
            },
            {
                name: 'New Delhi, India',
                description: 'For its stunning architecture',
                icon: '🏛️'
            },
            {
                name: 'Pokhara, Nepal',
                description: 'For nature-lovers',
                icon: '🏔️'
            },
            {
                name: 'Mumbai, India',
                description: "For its top-notch dining",
                icon: '🍽️'
            },
            {
                name: 'Bengaluru, India',
                description: 'For sights like Laibagh Botanical Garden',
                icon: '🌳'
            },
            {
                name: 'Varanasi, India',
                description: 'For a trip abroad',
                icon: '🕌'
            }
        ];

        // Open where picker on click
        if (whereField) {
            whereField.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other modals
                document.getElementById('datePickerModal')?.classList.remove('active');
                document.getElementById('guestPickerModal')?.classList.remove('active');
                wherePickerModal.classList.add('active');
                destinationSearch.value = '';
                destinationSearch.focus();
                this.renderDestinations(this.destinations);
            });
        }

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (wherePickerModal && 
                !wherePickerModal.contains(e.target) && 
                !whereField.contains(e.target)) {
                wherePickerModal.classList.remove('active');
            }
        });

        // Search functionality
        destinationSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = this.destinations.filter(dest =>
                dest.name.toLowerCase().includes(searchTerm) ||
                dest.description.toLowerCase().includes(searchTerm)
            );
            this.renderDestinations(filtered);
        });

        // Render initial destinations
        this.renderDestinations(this.destinations);
    },

    /**
     * Render destination items
     */
    renderDestinations(destinations) {
        const destinationsList = document.getElementById('destinationsList');
        destinationsList.innerHTML = '';

        destinations.forEach(dest => {
            const item = document.createElement('div');
            item.className = 'destination-item';
            item.innerHTML = `
                <div class="destination-icon">${dest.icon}</div>
                <div class="destination-info">
                    <div class="destination-name">${dest.name}</div>
                    <div class="destination-desc">${dest.description}</div>
                </div>
            `;

            item.addEventListener('click', () => {
                document.getElementById('whereField').setAttribute('data-destination', dest.name);
                document.getElementById('destination').value = dest.name;
                document.getElementById('mapLocation').textContent = dest.name;
                document.getElementById('wherePickerModal').classList.remove('active');
                
                // Auto-redirect to when field
                setTimeout(() => {
                    document.getElementById('whenField').click();
                }, 200);
            });

            destinationsList.appendChild(item);
        });
    },

    /**
     * Setup guest picker modal
     */
    setupGuestPicker() {
        const guestField = document.getElementById('guestField');
        const guestPickerModal = document.getElementById('guestPickerModal');
        const guestBtns = document.querySelectorAll('.guest-btn');

        // Guest count state
        this.guestCounts = {
            adults: 0,
            children: 0,
            infants: 0,
            pets: 0
        };

        // Open guest picker on click
        if (guestField) {
            guestField.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other modals
                document.getElementById('wherePickerModal')?.classList.remove('active');
                document.getElementById('datePickerModal')?.classList.remove('active');
                guestPickerModal.classList.add('active');
            });
        }

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (guestPickerModal && 
                !guestPickerModal.contains(e.target) && 
                !guestField.contains(e.target)) {
                guestPickerModal.classList.remove('active');
            }
        });

        // Plus/minus button event handling
        guestBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isPlus = btn.classList.contains('plus');
                const guestType = btn.getAttribute('data-type');
                
                if (isPlus) {
                    this.guestCounts[guestType]++;
                } else {
                    if (this.guestCounts[guestType] > 0) {
                        this.guestCounts[guestType]--;
                    }
                }

                // Update count display
                document.getElementById(guestType + 'Count').textContent = this.guestCounts[guestType];

                // Update guest field display
                this.updateGuestFieldDisplay();
            });
        });
    },

    /**
     * Update guest field display text
     */
    updateGuestFieldDisplay() {
        const guestField = document.getElementById('guestField');
        const totalGuests = this.guestCounts.adults + this.guestCounts.children + this.guestCounts.infants;
        
        let guestText = 'Add guests';
        if (totalGuests === 1) {
            guestText = '1 guest';
        } else if (totalGuests > 1) {
            guestText = totalGuests + ' guests';
        }
        
        guestField.setAttribute('data-guests', guestText);
        document.getElementById('mapGuests').textContent = guestText;
    },

    /**
     * Setup scroll listener for active nav tracking and search bar transform
     */
    setupScrollListener() {
        const navLinks = document.querySelectorAll('.navbar-center .nav-link');
        const sections = ['homes', 'experiences', 'services'];
        const searchHero = document.querySelector('.search-hero');
        
        let ticking = false;
        let lastScrollY = 0;
        let lastSearchState = false;
        
        const updateScroll = () => {
            lastScrollY = window.scrollY;
            
            // Transform search bar on scroll - check state change
            if (searchHero) {
                const shouldBeScrolled = lastScrollY > 150;
                if (shouldBeScrolled !== lastSearchState) {
                    if (shouldBeScrolled) {
                        searchHero.classList.add('scrolled');
                    } else {
                        searchHero.classList.remove('scrolled');
                    }
                    lastSearchState = shouldBeScrolled;
                }
            }
            
            // Update active nav link based on scroll position
            let currentSection = null;
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 3) {
                        currentSection = sectionId;
                    }
                }
            });

            // Update active class
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    },

    /**
     * Load popular hotels
     */
    loadPopularHotels() {
        this.loadHotelsFromDatabase();
    },

    /**
     * Load hotels from the database API
     */
    async loadHotelsFromDatabase() {
        try {
            const hotels = typeof HotelAPI !== 'undefined'
                ? await HotelAPI.listHotels({ limit: 6 })
                : [];
            const mappedHotels = hotels.map(hotel => ({
                ...hotel,
                name: hotel.name || hotel.title,
                isFavorite: false,
                isGuestFavorite: Number(hotel.rating) >= 4.8
            }));

            const container = document.getElementById('popularHotels');
            if (container) {
                container.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                this.attachCardListeners();
                this.attachImageFallbacks();
            }

            const container2 = document.getElementById('nextMonthHotels');
            if (container2) {
                container2.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                this.attachCardListeners();
                this.attachImageFallbacks();
            }

            const container3 = document.getElementById('tokyoHotels');
            if (container3) {
                container3.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                this.attachCardListeners();
                this.attachImageFallbacks();
            }
        } catch (error) {
            console.warn('Failed to load hotels from database:', error);
        }
    },

    /**
     * Create star rating HTML
     */
    createStarRating(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            const iconClass = i < fullStars ? 'fas' : 'far';
            stars.push(`<i class="${iconClass} fa-star star"></i>`);
        }
        return stars.join('');
    },

    /**
     * Create property card HTML
     */
    createPropertyCard(hotel) {
        const stars = '★'.repeat(Math.floor(hotel.rating));
        const starHTML = `<span class="stars">${stars}</span>`;
        const fallback = typeof HotelAPI !== 'undefined' ? HotelAPI.placeholderImage : '';
        const image = typeof HotelAPI !== 'undefined'
            ? HotelAPI.getSafeImageUrl(hotel.image)
            : hotel.image;
        
        return `
            <div class="property-card" data-hotel-id="${hotel.id}">
                <div class="property-image-wrapper">
                    <img src="${image}" data-fallback="${fallback}" alt="${hotel.name}" class="property-image">
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
            card.addEventListener('click', (e) => {
                if (!e.target.closest('[data-favorite-btn]')) {
                    const hotelId = card.getAttribute('data-hotel-id');
                    window.location.href = `pages/hotel-details.html?id=${hotelId}`;
                }
            });
        });
    },

    /**
     * Attach fallback handlers for broken images
     */
    attachImageFallbacks() {
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            if (img.dataset.bound === 'true') {
                return;
            }
            img.dataset.bound = 'true';
            img.addEventListener('error', () => {
                img.src = img.dataset.fallback;
            });
        });
    },

    /**
     * Update auth links in the navigation menu
     */
    updateAuthUI() {
        if (typeof Utils === 'undefined') {
            return;
        }

        const user = Utils.getFromStorage('currentUser');
        const loginLinks = document.querySelectorAll('[data-auth="login"]');
        const registerLinks = document.querySelectorAll('[data-auth="register"]');
        const accountLinks = document.querySelectorAll('[data-auth="account"]');
        const logoutLinks = document.querySelectorAll('[data-auth="logout"]');

        const setHidden = (element, hidden) => {
            if (!element) {
                return;
            }
            element.hidden = hidden;
            const container = element.closest('li');
            if (container && container.hasAttribute('hidden')) {
                container.hidden = hidden;
            }
        };

        if (user) {
            loginLinks.forEach(link => setHidden(link, true));
            registerLinks.forEach(link => setHidden(link, true));
            accountLinks.forEach(link => {
                setHidden(link, false);
                const label = link.querySelector('span');
                const text = user.name ? `Hi, ${user.name}` : 'My Account';
                if (label) {
                    label.textContent = text;
                } else {
                    link.textContent = text;
                }
            });
            logoutLinks.forEach(link => {
                setHidden(link, false);
                if (!link.dataset.bound) {
                    link.dataset.bound = 'true';
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        Utils.removeFromStorage('currentUser');
                        Utils.removeFromStorage('rememberEmail');
                        this.updateAuthUI();
                    });
                }
            });
        } else {
            loginLinks.forEach(link => setHidden(link, false));
            registerLinks.forEach(link => setHidden(link, false));
            accountLinks.forEach(link => setHidden(link, true));
            logoutLinks.forEach(link => setHidden(link, true));
        }
    },

    /**
     * Handle search form submission
     */
    handleSearch(e) {
        e.preventDefault();
        
        // Get values from the 3W search bar
        const destinationInput = document.getElementById('destination');
        const whenField = document.getElementById('whenField');
        const guestField = document.getElementById('guestField');
        
        const destination = destinationInput?.value || 'Homes nearby';
        const checkIn = whenField?.getAttribute('data-date') || 'Any week';
        const guestCount = guestField?.getAttribute('data-guests') || 'Add guests';
        
        // Update map search bar with current selections
        const mapLocation = document.getElementById('mapLocation');
        const mapDates = document.getElementById('mapDates');
        const mapGuests = document.getElementById('mapGuests');
        
        if (mapLocation) mapLocation.textContent = destination;
        if (mapDates) mapDates.textContent = checkIn;
        if (mapGuests) mapGuests.textContent = guestCount;
        
        // Populate properties grid
        this.populateMapProperties();
        
        // Open map view modal
        const mapViewModal = document.getElementById('mapViewModal');
        if (mapViewModal) {
            mapViewModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    },
    
    /**
     * Get comprehensive property details
     */
    async getPropertyDetails(id) {
        if (typeof HotelAPI === 'undefined') {
            return null;
        }

        try {
            return await HotelAPI.getHotel(id);
        } catch (error) {
            console.warn('Failed to fetch hotel details:', error);
            return null;
        }
    },

    /**
     * Show property details modal
     */
    async showPropertyDetails(propertyId) {
        const property = await this.getPropertyDetails(propertyId);
        if (!property) return;
        
        const modal = document.getElementById('propertyDetailsModal');
        
        // Populate basic info
        document.getElementById('propertyTitle').textContent = property.title;
        document.getElementById('propertyLocation').textContent = property.location;
        document.getElementById('propertyPrice').textContent = `$${property.price}`;
        document.getElementById('propertyDescription').textContent = property.description;
        
        // Rating
        document.getElementById('ratingStars').innerHTML = '★'.repeat(Math.floor(property.rating)) + (property.rating % 1 ? '½' : '');
        document.getElementById('ratingReviews').textContent = `${property.rating} (${property.reviews} reviews)`;
        
        // Rooms info
        document.getElementById('bedrooms').textContent = `${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}`;
        document.getElementById('beds').textContent = `${property.beds} bed${property.beds !== 1 ? 's' : ''}`;
        document.getElementById('bathrooms').textContent = `${property.bathrooms} bathroom${property.bathrooms !== 1 ? 's' : ''}`;
        document.getElementById('guests').textContent = `${property.guests} guests`;
        
        // Images
        const mainImage = document.getElementById('mainImage');
        mainImage.src = property.images[0];
        
        const thumbnails = document.getElementById('thumbnails');
        thumbnails.innerHTML = property.images.map((img, idx) => `
            <img src="${img}" alt="Photo ${idx + 1}" class="${idx === 0 ? 'active' : ''}" onclick="InnStay.changeMainImage('${img}', this)">
        `).join('');
        
        // Amenities
        const amenitiesList = document.getElementById('amenitiesList');
        amenitiesList.innerHTML = property.amenities.map(amenity => `
            <div class="amenity-item">
                <i class="fas fa-check"></i>
                <span>${amenity}</span>
            </div>
        `).join('');
        
        // Host info
        const host = property.host;
        document.getElementById('hostPhoto').src = host.photo;
        document.getElementById('hostName').textContent = host.name;
        document.getElementById('hostBadge').textContent = host.superhost ? 'Superhost' : `Host for ${host.years} year${host.years !== 1 ? 's' : ''}`;
        document.getElementById('hostDetails').textContent = `${host.reviews} reviews • ${host.rating} rating`;
        document.getElementById('hostResponse').textContent = `Responds within ${host.responseTime} • ${host.responseRate} response rate`;
        
        // Ratings breakdown
        const ratingsList = document.getElementById('ratingsList');
        const breakdown = property.ratingBreakdown;
        const maxRating = 5;
        ratingsList.innerHTML = Object.entries(breakdown).map(([key, value]) => `
            <div class="rating-item">
                <span class="rating-name">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <div class="rating-bar">
                    <div class="rating-fill" style="width: ${(value / maxRating) * 100}%"></div>
                </div>
                <span class="rating-value">${value.toFixed(1)}</span>
            </div>
        `).join('');
        
        // Reviews
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = property.reviews_data.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="reviewer-name">${review.reviewer}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">★${' '.repeat(Math.floor(review.rating - 1))} ${review.rating}</div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
        
        // Booking info
        document.getElementById('cancellationPolicy').textContent = property.cancellation;
        document.getElementById('checkIn').textContent = property.checkIn;
        document.getElementById('checkOut').textContent = property.checkOut;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    /**
     * Close property details modal
     */
    closePropertyDetails() {
        const modal = document.getElementById('propertyDetailsModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    },
    
    /**
     * Change main image
     */
    changeMainImage(src, thumbnail) {
        document.getElementById('mainImage').src = src;
        document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
        thumbnail.classList.add('active');
    },

    /**
     * Populate properties in map view
     */
    populateMapProperties() {
        const propertiesGrid = document.getElementById('mapPropertiesGrid');
        if (!propertiesGrid) return;
        
        // Clear existing properties
        propertiesGrid.innerHTML = '';
        
        // Use sample hotel data
        const hotels = [
            {
                id: 1,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/1e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Townhouse',
                title: 'Charming Downtown Loft',
                location: 'New York, NY',
                rating: 4.8,
                reviews: 128,
                price: 185,
                pernight: 'night'
            },
            {
                id: 2,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/2e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Apartment',
                title: 'Modern City Center Suite',
                location: 'New York, NY',
                rating: 4.9,
                reviews: 256,
                price: 215,
                pernight: 'night'
            },
            {
                id: 3,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733252/original/3e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Studio',
                title: 'Cozy Studio with Rooftop',
                location: 'New York, NY',
                rating: 4.7,
                reviews: 89,
                price: 145,
                pernight: 'night'
            },
            {
                id: 4,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/4e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Townhouse',
                title: 'Luxury 3-Bedroom Brownstone',
                location: 'Brooklyn, NY',
                rating: 4.95,
                reviews: 342,
                price: 325,
                pernight: 'night'
            },
            {
                id: 5,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733254/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Apartment',
                title: 'Trendy SoHo Loft',
                location: 'New York, NY',
                rating: 4.85,
                reviews: 201,
                price: 275,
                pernight: 'night'
            },
            {
                id: 6,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Penthouse',
                title: 'Stunning Manhattan Penthouse',
                location: 'New York, NY',
                rating: 5.0,
                reviews: 183,
                price: 450,
                pernight: 'night'
            },
            {
                id: 7,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733256/original/7e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Cottage',
                title: 'Charming Brooklyn Heights Cottage',
                location: 'Brooklyn, NY',
                rating: 4.82,
                reviews: 167,
                price: 195,
                pernight: 'night'
            },
            {
                id: 8,
                image: 'https://a0.muscache.com/im/pictures/miso/Hosting-733257/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                tag: 'Studio',
                title: 'Budget-Friendly East Village Studio',
                location: 'New York, NY',
                rating: 4.6,
                reviews: 145,
                price: 125,
                pernight: 'night'
            }
        ];
        
        // Render property cards
        hotels.forEach(hotel => {
            const card = document.createElement('div');
            card.className = 'map-property-card';
            card.innerHTML = `
                <div class="map-property-image">
                    <img src="${hotel.image}" alt="${hotel.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px 12px 0 0;">
                </div>
                <div class="map-property-info">
                    <div class="property-tag">${hotel.tag}</div>
                    <h3 class="property-title">${hotel.title}</h3>
                    <p class="property-location">${hotel.location}</p>
                    <div class="property-rating">
                        <span class="rating-stars">★ ${hotel.rating}</span>
                        <span class="review-count">(${hotel.reviews})</span>
                    </div>
                    <div class="property-price">
                        <span class="price-amount">$${hotel.price}</span>
                        <span class="price-label">/${hotel.pernight}</span>
                    </div>
                </div>
            `;
            propertiesGrid.appendChild(card);
        });
        
        // Initialize map after rendering properties
        this.initializeMap();
    },
    
    /**
     * Initialize map visualization with property pins using Leaflet
     */
    initializeMap() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        // Clear existing map
        mapContainer.innerHTML = '';
        
        // Initialize Leaflet map centered on New York
        const map = L.map(mapContainer, {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([40.7128, -74.0060], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 10
        }).addTo(map);
        
        // Property data with coordinates (New York area)
        const properties = [
            { id: 1, price: 185, lat: 40.7580, lng: -73.9855, title: 'Downtown Loft' },
            { id: 2, price: 215, lat: 40.7614, lng: -73.9776, title: 'City Center Suite' },
            { id: 3, price: 145, lat: 40.7489, lng: -73.9680, title: 'Studio with Rooftop' },
            { id: 4, price: 325, lat: 40.6782, lng: -73.9442, title: 'Luxury Brownstone' },
            { id: 5, price: 275, lat: 40.7549, lng: -73.9840, title: 'SoHo Loft' },
            { id: 6, price: 450, lat: 40.7505, lng: -73.9934, title: 'Manhattan Penthouse' },
            { id: 7, price: 195, lat: 40.6920, lng: -73.9900, title: 'Brooklyn Heights Cottage' },
            { id: 8, price: 125, lat: 40.7200, lng: -73.9850, title: 'East Village Studio' }
        ];
        
        // Store markers for later reference
        this.mapMarkers = {};
        const markerGroup = L.featureGroup();
        
        // Add property markers
        properties.forEach(prop => {
            // Create custom HTML for marker
            const markerHtml = `
                <div style="
                    background: white; 
                    border: 2px solid #FF5A5F; 
                    border-radius: 50%; 
                    width: 56px; 
                    height: 56px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold; 
                    color: #FF5A5F; 
                    font-size: 13px; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">$${prop.price}</div>
            `;
            
            const priceIcon = L.divIcon({
                className: 'price-marker',
                html: markerHtml,
                iconSize: [56, 56],
                iconAnchor: [28, 28],
                popupAnchor: [0, -28]
            });
            
            // Add marker to map
            const marker = L.marker([prop.lat, prop.lng], { icon: priceIcon })
                .bindPopup(`<div style="font-weight: 500; color: #484848;"><strong>${prop.title}</strong><br><span style="color: #FF5A5F; font-weight: 600;">$${prop.price}/night</span></div>`, {
                    maxWidth: 200,
                    className: 'property-popup'
                })
                .addTo(map);
            
            markerGroup.addLayer(marker);
            
            // Store marker reference
            this.mapMarkers[prop.id] = marker;
            
            // Click marker to highlight property in list
            marker.on('click', () => {
                const propertyCard = document.querySelector(`.map-property-card:nth-child(${prop.id})`);
                if (propertyCard) {
                    propertyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    propertyCard.style.backgroundColor = '#fff9f5';
                    setTimeout(() => {
                        propertyCard.style.backgroundColor = 'white';
                    }, 1500);
                }
            });
        });
        
        // Fit map to all markers with padding
        map.fitBounds(markerGroup.getBounds().pad(0.1));
        
        // Ensure map height is set after initialization
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
        // Store map reference for later use
        this.map = map;
    },
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