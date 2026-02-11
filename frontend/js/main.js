/* ============================================
   InnStay - Main JavaScript Module
   Description: Core functionality for InnStay
   ============================================ */

const InnStay = {
    // Configuration
    config: {
        apiUrl: 'http://localhost:5000/api',
        useLocalData: false, // Set to true to use hardcoded data instead of API
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('InnStay initialized');
        this.setupEventListeners();
        this.setupScrollListener();
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
        if (!this.config.useLocalData) {
            this.fetchHotelsFromAPI();
        } else {
            this.loadLocalHotels();
        }
    },

    /**
     * Fetch hotels from API
     */
    fetchHotelsFromAPI() {
        fetch(`${this.config.apiUrl}/hotels?limit=6`)
            .then(response => {
                if (!response.ok) throw new Error('API request failed');
                return response.json();
            })
            .then(data => {
                const hotels = data.hotels || [];
                const mappedHotels = hotels.map((h, idx) => ({
                    id: h.id || idx + 1,
                    name: h.title || h.name || 'Hotel',
                    location: h.location || 'Location',
                    price: h.price || 100,
                    rating: h.rating || 4.5,
                    reviews: h.reviews || 100,
                    image: h.image || h.photo_url || 'https://via.placeholder.com/280x260',
                    isFavorite:false,
                    isGuestFavorite: Math.random() > 0.5
                }));
                
                const container = document.getElementById('popularHotels');
                if (container) {
                    container.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                    this.attachCardListeners();
                }
                const container2 = document.getElementById('nextMonthHotels');
                if (container2) {
                    container2.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                    this.attachCardListeners();
                }
                const container3 = document.getElementById('tokyoHotels');
                if (container3) {
                    container3.innerHTML = mappedHotels.map(hotel => this.createPropertyCard(hotel)).join('');
                    this.attachCardListeners();
                }
                console.log('Hotels loaded from API:', mappedHotels.length);
            })
            .catch(error => {
                console.warn('API error, falling back to local data:', error);
                this.loadLocalHotels();
            });
    },

    /**
     * Load local hotels (fallback)
     */
    loadLocalHotels() {
        const hotels = [
            {
                id: 1,
                name: 'Charming Downtown Loft',
                location: 'Lower Manhattan, New York, NY',
                price: 185,
                rating: 4.86,
                reviews: 218,
                image: 'https://images.unsplash.com/photo-1631049307038-da31e36f2d5c?w=500',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 2,
                name: 'Modern City Center Suite',
                location: 'Midtown Manhattan, New York, NY',
                price: 215,
                rating: 4.94,
                reviews: 289,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 3,
                name: 'Cozy Studio with Rooftop',
                location: 'Upper West Side, New York, NY',
                price: 145,
                rating: 4.78,
                reviews: 156,
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500',
                isFavorite: false,
                isGuestFavorite: false
            },
            {
                id: 4,
                name: 'Luxury 3-Bedroom Brownstone',
                location: 'Brooklyn Heights, New York, NY',
                price: 325,
                rating: 4.95,
                reviews: 342,
                image: 'https://images.unsplash.com/photo-1614008375896-cb53fc677b86?w=500',
                isFavorite: false,
                isGuestFavorite: true
            },
            {
                id: 5,
                name: 'Trendy SoHo Loft',
                location: 'SoHo, New York, NY',
                price: 275,
                rating: 4.85,
                reviews: 201,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                isFavorite: false,
                isGuestFavorite: false
            },
            {
                id: 6,
                name: 'Stunning Manhattan Penthouse',
                location: 'Tribeca, New York, NY',
                price: 450,
                rating: 5.0,
                reviews: 183,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
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
        console.log('Using local hotel data');
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
            card.addEventListener('click', (e) => {
                if (!e.target.closest('[data-favorite-btn]')) {
                    const hotelId = card.getAttribute('data-hotel-id');
                    window.location.href = `pages/hotel-details.html?id=${hotelId}`;
                }
            });
        });
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
    getPropertyDetails(id) {
        const propertiesDB = {
            1: {
                id: 1,
                title: 'Charming Downtown Loft',
                location: 'Lower Manhattan, New York, NY',
                price: 185,
                rating: 4.86,
                reviews: 218,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/1e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/2e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/3e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/4e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733250/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Beautiful loft in the heart of downtown Manhattan. Exposed brick, high ceilings, and plenty of natural light. Perfect for couples or solo travelers. Located near great restaurants, bars, and shopping.',
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                guests: 2,
                amenities: ['WiFi', 'Air conditioning', 'Heating', 'Kitchen', 'Refrigerator', 'Dishwasher', 'Oven', 'Stove', 'Microwave', 'Washer', 'Dryer', 'TV', 'Iron'],
                host: {
                    name: 'Marcus',
                    years: 3,
                    rating: 4.88,
                    reviews: 218,
                    photo: 'https://a0.muscache.com/im/pictures/user/8a8d4d6a-0a15-4a4a-8b0f-0f0f0f0f0f0f/original/user-0.jpg',
                    superhost: true,
                    responseTime: '1 hour',
                    responseRate: '100%'
                },
                cancellation: 'Free cancellation before April 12',
                checkIn: '4pm',
                checkOut: '11am',
                reviews_data: [
                    { reviewer: 'Sarah', date: 'January 2026', rating: 5, text: 'Amazing loft with perfect location! Marcus was very helpful.' },
                    { reviewer: 'John', date: 'December 2025', rating: 5, text: 'Beautiful space, clean, and great for exploring the city.' },
                    { reviewer: 'Emma', date: 'November 2025', rating: 4, text: 'Great location, only wish the kitchen was bigger.' }
                ],
                ratingBreakdown: { cleanliness: 4.9, accuracy: 4.9, checkin: 5.0, communication: 5.0, location: 4.9, value: 4.8 }
            },
            2: {
                id: 2,
                title: 'Modern City Center Suite',
                location: 'Midtown, New York, NY',
                price: 215,
                rating: 4.94,
                reviews: 289,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/2e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/3e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/4e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733251/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Elegant modern suite in the heart of Midtown Manhattan. Floor-to-ceiling windows with city views. Contemporary furnishings and all modern amenities. Walking distance to Times Square, Central Park, and major attractions.',
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                guests: 2,
                amenities: ['WiFi', 'Air conditioning', 'Heating', 'Kitchen', 'Washer/Dryer', 'TV', 'Dishwasher', 'Oven', 'Microwave', 'Iron', 'Hair dryer', 'Crib'],
                host: {
                    name: 'Alexandra',
                    years: 5,
                    rating: 4.92,
                    reviews: 289,
                    photo: 'https://a0.muscache.com/im/pictures/user/9b9e5e7b-1b26-5b5b-9c1g-1g1g1g1g1g1g/original/user-1.jpg',
                    superhost: true,
                    responseTime: '30 minutes',
                    responseRate: '100%'
                },
                cancellation: 'Moderate cancellation: Free until 5 days before',
                checkIn: '3pm',
                checkOut: '11am',
                reviews_data: [
                    { reviewer: 'David', date: 'January 2026', rating: 5, text: 'Fantastic location and amazing host! Would definitely stay again.' },
                    { reviewer: 'Lisa', date: 'December 2025', rating: 5, text: 'Beautiful modern apartment with stunning city views.' },
                    { reviewer: 'Michael', date: 'November 2025', rating: 5, text: 'Perfect for a business trip or vacation. Everything is perfect!' }
                ],
                ratingBreakdown: { cleanliness: 5.0, accuracy: 4.9, checkin: 4.9, communication: 5.0, location: 5.0, value: 4.9 }
            },
            3: {
                id: 3,
                title: 'Cozy Studio with Rooftop',
                location: 'Upper West Side, New York, NY',
                price: 145,
                rating: 4.78,
                reviews: 156,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733252/original/3e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733252/original/4e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733252/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733252/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Bright and airy studio with access to a shared rooftop terrace. Great natural light and modern furnishings. Perfect for solo travelers or couples. Near Central Park and museums.',
                bedrooms: 0,
                beds: 1,
                bathrooms: 1,
                guests: 1,
                amenities: ['WiFi', 'Air conditioning', 'Heating', 'Kitchen', 'Refrigerator', 'Microwave', 'TV', 'Washer', 'Iron', 'Desk', 'Rooftop access'],
                host: {
                    name: 'James',
                    years: 2,
                    rating: 4.75,
                    reviews: 156,
                    photo: 'https://a0.muscache.com/im/pictures/user/7c7f4c5a-0c37-6c6c-8d0h-2h2h2h2h2h2h/original/user-2.jpg',
                    superhost: false,
                    responseTime: '2 hours',
                    responseRate: '98%'
                },
                cancellation: 'Strict: Free until 1 day before',
                checkIn: '4pm',
                checkOut: '10am',
                reviews_data: [
                    { reviewer: 'Sophie', date: 'January 2026', rating: 5, text: 'Loved the rooftop access! Great value for money.' },
                    { reviewer: 'Lucas', date: 'December 2025', rating: 4, text: 'Nice studio, good location, a bit small.' }
                ],
                ratingBreakdown: { cleanliness: 4.8, accuracy: 4.7, checkin: 4.6, communication: 4.8, location: 4.9, value: 4.8 }
            },
            4: {
                id: 4,
                title: 'Luxury 3-Bedroom Brownstone',
                location: 'Brooklyn Heights, Brooklyn, NY',
                price: 325,
                rating: 4.95,
                reviews: 342,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/4e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/7e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733253/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Stunning 3-bedroom brownstone in the heart of Brooklyn Heights. Original hardwood floors, high ceilings, and gorgeous natural light. Beautiful garden access. Perfect for families or groups.',
                bedrooms: 3,
                beds: 4,
                bathrooms: 2,
                guests: 6,
                amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Air conditioning', 'Heating', 'Dishwasher', 'Oven', 'Refrigerator', 'TV', 'Iron', 'Crib', 'Garden', 'Parking'],
                host: {
                    name: 'Patricia',
                    years: 8,
                    rating: 4.96,
                    reviews: 342,
                    photo: 'https://a0.muscache.com/im/pictures/user/5a5d3d4a-2d48-7d7d-9e1i-3i3i3i3i3i3i/original/user-3.jpg',
                    superhost: true,
                    responseTime: '1 hour',
                    responseRate: '100%'
                },
                cancellation: 'Moderate: Free until 5 days before',
                checkIn: '3pm',
                checkOut: '11am',
                reviews_data: [
                    { reviewer: 'Robert', date: 'January 2026', rating: 5, text: 'Absolutely gorgeous brownstone! Patricia is amazing.' },
                    { reviewer: 'Jennifer', date: 'December 2025', rating: 5, text: 'Perfect for our family vacation! Highly recommended.' },
                    { reviewer: 'William', date: 'November 2025', rating: 5, text: 'Beautiful place with great amenities and host.' }
                ],
                ratingBreakdown: { cleanliness: 5.0, accuracy: 4.9, checkin: 5.0, communication: 5.0, location: 4.9, value: 4.9 }
            },
            5: {
                id: 5,
                title: 'Trendy SoHo Loft',
                location: 'SoHo, New York, NY',
                price: 275,
                rating: 4.85,
                reviews: 201,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733254/original/5e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733254/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733254/original/7e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733254/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Chic and stylish loft in trendy SoHo. Industrial aesthetic with modern comforts. Great location near boutiques, galleries, and restaurants. Perfect for exploring downtown.',
                bedrooms: 2,
                beds: 2,
                bathrooms: 1,
                guests: 4,
                amenities: ['WiFi', 'Air conditioning', 'Heating', 'Kitchen', 'Washer/Dryer', 'TV', 'Dishwasher', 'Iron', 'Desk', 'Work space'],
                host: {
                    name: 'Victoria',
                    years: 4,
                    rating: 4.86,
                    reviews: 201,
                    photo: 'https://a0.muscache.com/im/pictures/user/8c8f5d6b-3e49-8e8e-9f2j-4j4j4j4j4j4j/original/user-4.jpg',
                    superhost: true,
                    responseTime: '45 minutes',
                    responseRate: '100%'
                },
                cancellation: 'Flexible: Free until 1 day before',
                checkIn: '4pm',
                checkOut: '11am',
                reviews_data: [
                    { reviewer: 'Nicole', date: 'January 2026', rating: 5, text: 'Amazing loft in the perfect location! Victoria is great.' },
                    { reviewer: 'Andrew', date: 'December 2025', rating: 5, text: 'Love the vibe of this place. Great SoHo experience.' }
                ],
                ratingBreakdown: { cleanliness: 4.9, accuracy: 4.8, checkin: 4.9, communication: 4.9, location: 5.0, value: 4.7 }
            },
            6: {
                id: 6,
                title: 'Stunning Manhattan Penthouse',
                location: 'Tribeca, New York, NY',
                price: 450,
                rating: 5.0,
                reviews: 183,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/6e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/7e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/9e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733255/original/10e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Breathtaking penthouse with panoramic city views. Luxurious finishes, top-of-the-line appliances, and spacious terrace. Perfect for luxury travelers and special occasions.',
                bedrooms: 3,
                beds: 4,
                bathrooms: 3,
                guests: 8,
                amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Air conditioning', 'Heating', 'Dishwasher', 'Oven', 'Refrigerator', 'TV', 'Home theater', 'Gym equipment', 'Terrace', '24-hour security'],
                host: {
                    name: 'Richard',
                    years: 10,
                    rating: 5.0,
                    reviews: 183,
                    photo: 'https://a0.muscache.com/im/pictures/user/9d9g6e7c-4f50-9f9f-0g3k-5k5k5k5k5k5k/original/user-5.jpg',
                    superhost: true,
                    responseTime: 'Within 15 minutes',
                    responseRate: '100%'
                },
                cancellation: 'Moderate: Free until 3 days before',
                checkIn: '4pm',
                checkOut: '11am',
                reviews_data: [
                    { reviewer: 'Catherine', date: 'January 2026', rating: 5, text: 'Unforgettable experience! The penthouse is absolutely stunning.' },
                    { reviewer: 'Thomas', date: 'December 2025', rating: 5, text: 'Luxury at its finest. Highly recommend for a special trip.' }
                ],
                ratingBreakdown: { cleanliness: 5.0, accuracy: 5.0, checkin: 5.0, communication: 5.0, location: 5.0, value: 5.0 }
            },
            7: {
                id: 7,
                title: 'Charming Brooklyn Heights Cottage',
                location: 'Brooklyn, NY',
                price: 195,
                rating: 4.82,
                reviews: 167,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733256/original/7e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733256/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733256/original/9e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733256/original/10e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Charming cottage in peaceful Brooklyn neighborhood. Quiet tree-lined street, private yard, and local charm. Perfect for those seeking a residential feel while staying close to the city.',
                bedrooms: 2,
                beds: 2,
                bathrooms: 1,
                guests: 4,
                amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Air conditioning', 'Heating', 'Garden', 'Patio', 'TV', 'Iron', 'Dishwasher'],
                host: {
                    name: 'Susan',
                    years: 6,
                    rating: 4.81,
                    reviews: 167,
                    photo: 'https://a0.muscache.com/im/pictures/user/7e7h6f8d-5g51-0g0g-1h4l-6l6l6l6l6l6l/original/user-6.jpg',
                    superhost: true,
                    responseTime: '1 hour',
                    responseRate: '99%'
                },
                cancellation: 'Moderate: Free until 5 days before',
                checkIn: '3pm',
                checkOut: '10am',
                reviews_data: [
                    { reviewer: 'Margaret', date: 'January 2026', rating: 5, text: 'Lovely cottage with great hosts! Such a peaceful place.' },
                    { reviewer: 'George', date: 'December 2025', rating: 5, text: 'Perfect Brooklyn escape. Highly recommended.' }
                ],
                ratingBreakdown: { cleanliness: 4.8, accuracy: 4.8, checkin: 4.8, communication: 4.9, location: 4.8, value: 4.8 }
            },
            8: {
                id: 8,
                title: 'Budget-Friendly East Village Studio',
                location: 'East Village, New York, NY',
                price: 125,
                rating: 4.60,
                reviews: 145,
                images: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733257/original/8e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733257/original/9e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733257/original/10e88ede8-659c-45d0-9905-127900ddf9d9.jpeg',
                    'https://a0.muscache.com/im/pictures/miso/Hosting-733257/original/11e88ede8-659c-45d0-9905-127900ddf9d9.jpeg'
                ],
                description: 'Affordable studio in the vibrant East Village neighborhood. Close to great bars, restaurants, and music venues. Perfect for budget-conscious travelers who want to experience the city.',
                bedrooms: 0,
                beds: 1,
                bathrooms: 1,
                guests: 1,
                amenities: ['WiFi', 'Air conditioning', 'Kitchen', 'Refrigerator', 'Microwave', 'TV', 'Iron', 'Desk'],
                host: {
                    name: 'Kevin',
                    years: 3,
                    rating: 4.58,
                    reviews: 145,
                    photo: 'https://a0.muscache.com/im/pictures/user/8f8i7g9e-6h52-1h1h-2i5m-7m7m7m7m7m7m/original/user-7.jpg',
                    superhost: false,
                    responseTime: '2-3 hours',
                    responseRate: '95%'
                },
                cancellation: 'Strict: Free until 2 days before',
                checkIn: '4pm',
                checkOut: '10am',
                reviews_data: [
                    { reviewer: 'Rachel', date: 'January 2026', rating: 4, text: 'Great value for NYC! Location is fantastic.' },
                    { reviewer: 'Brian', date: 'December 2025', rating: 5, text: 'Best budget option in the East Village!' }
                ],
                ratingBreakdown: { cleanliness: 4.6, accuracy: 4.5, checkin: 4.6, communication: 4.7, location: 4.7, value: 4.6 }
            }
        };
        
        return propertiesDB[id];
    },

    /**
     * Show property details modal
     */
    showPropertyDetails(propertyId) {
        const property = this.getPropertyDetails(propertyId);
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