const HotelStore = {
    storageKey: 'adminHotels',
    placeholderImage: 'https://via.placeholder.com/800x600?text=InnStay+Hotel',

    getSeedHotels() {
        return [
            {
                id: 1,
                name: 'Charming Downtown Loft',
                location: 'Lower Manhattan, New York, NY',
                price: 185,
                rating: 4.86,
                reviews: 218,
                image: 'https://images.unsplash.com/photo-1631049307038-da31e36f2d5c?w=800',
                amenities: ['WiFi', 'Kitchen', 'Air conditioning'],
                description: 'Bright loft with skyline views and easy access to downtown hotspots.',
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                guests: 2,
                status: 'Active'
            },
            {
                id: 2,
                name: 'Modern City Center Suite',
                location: 'Midtown Manhattan, New York, NY',
                price: 215,
                rating: 4.94,
                reviews: 289,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                amenities: ['WiFi', 'Workspace', 'Gym'],
                description: 'Contemporary suite steps away from iconic city attractions.',
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                guests: 2,
                status: 'Active'
            },
            {
                id: 3,
                name: 'Cozy Studio with Rooftop',
                location: 'Upper West Side, New York, NY',
                price: 145,
                rating: 4.78,
                reviews: 156,
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
                amenities: ['WiFi', 'Rooftop', 'Kitchen'],
                description: 'Studio retreat with private rooftop access and skyline views.',
                bedrooms: 0,
                beds: 1,
                bathrooms: 1,
                guests: 2,
                status: 'Active'
            },
            {
                id: 4,
                name: 'Luxury Brownstone Escape',
                location: 'Brooklyn Heights, New York, NY',
                price: 325,
                rating: 4.95,
                reviews: 342,
                image: 'https://images.unsplash.com/photo-1614008375896-cb53fc677b86?w=800',
                amenities: ['WiFi', 'Garden', 'Parking'],
                description: 'Elegant brownstone with private garden and premium finishes.',
                bedrooms: 3,
                beds: 4,
                bathrooms: 2,
                guests: 6,
                status: 'Active'
            },
            {
                id: 5,
                name: 'Trendy SoHo Loft',
                location: 'SoHo, New York, NY',
                price: 275,
                rating: 4.85,
                reviews: 201,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
                amenities: ['WiFi', 'Washer', 'Workspace'],
                description: 'Industrial loft with designer touches in a prime shopping district.',
                bedrooms: 2,
                beds: 2,
                bathrooms: 1,
                guests: 4,
                status: 'Active'
            },
            {
                id: 6,
                name: 'Stunning Manhattan Penthouse',
                location: 'Tribeca, New York, NY',
                price: 450,
                rating: 5.0,
                reviews: 183,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                amenities: ['WiFi', 'Terrace', 'Concierge'],
                description: 'Penthouse stay with panoramic city views and luxury amenities.',
                bedrooms: 3,
                beds: 4,
                bathrooms: 3,
                guests: 8,
                status: 'Active'
            }
        ];
    },

    ensureSeeded() {
        const existing = this.getHotels();
        if (!existing || existing.length === 0) {
            this.saveHotels(this.getSeedHotels());
        }
    },

    getHotels() {
        if (typeof Utils === 'undefined' || !Utils.getFromStorage) {
            return [];
        }
        return Utils.getFromStorage(this.storageKey) || [];
    },

    saveHotels(hotels) {
        if (typeof Utils === 'undefined' || !Utils.saveToStorage) {
            return;
        }
        Utils.saveToStorage(this.storageKey, hotels);
    },

    parseList(value) {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return String(value)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    },

    getSafeImageUrl(url) {
        const clean = (url || '').toString().trim();
        return clean ? clean : this.placeholderImage;
    },

    normalizeHotel(hotel) {
        const base = hotel || {};
        const name = base.name || base.title || 'Untitled Hotel';
        const images = Array.isArray(base.images) ? base.images : this.parseList(base.images);
        const primaryImage = this.getSafeImageUrl(base.image || images[0]);
        const gallery = images.length
            ? images.map(img => this.getSafeImageUrl(img))
            : [primaryImage, primaryImage, primaryImage];
        const rating = Number(base.rating) || 4.5;
        const reviews = Number(base.reviews) || 0;

        return {
            id: base.id || 0,
            title: name,
            name: name,
            location: base.location || 'Unknown location',
            price: Number(base.price) || 120,
            rating: rating,
            reviews: reviews,
            image: primaryImage,
            images: gallery,
            description: base.description || 'No description has been added yet.',
            bedrooms: Number(base.bedrooms) || 1,
            beds: Number(base.beds) || 1,
            bathrooms: Number(base.bathrooms) || 1,
            guests: Number(base.guests) || 2,
            amenities: this.parseList(base.amenities),
            status: base.status || 'Active',
            host: base.host || {
                name: base.hostName || 'InnStay Host',
                years: 3,
                rating: rating,
                reviews: reviews,
                photo: this.placeholderImage,
                superhost: false,
                responseTime: '2 hours',
                responseRate: '95%'
            },
            cancellation: base.cancellation || 'Flexible: Free until 1 day before',
            checkIn: base.checkIn || '3pm',
            checkOut: base.checkOut || '11am',
            reviews_data: base.reviews_data || [],
            ratingBreakdown: base.ratingBreakdown || {
                cleanliness: rating,
                accuracy: rating,
                checkin: rating,
                communication: rating,
                location: rating,
                value: rating
            }
        };
    },

    getNormalizedHotels() {
        this.ensureSeeded();
        return this.getHotels().map((hotel, index) => {
            const id = Number(hotel.id) || index + 1;
            return this.normalizeHotel({ ...hotel, id: id });
        });
    },

    getHotelById(id) {
        const numericId = Number(id);
        if (!numericId) {
            return null;
        }
        const hotels = this.getNormalizedHotels();
        return hotels.find(hotel => Number(hotel.id) === numericId) || null;
    },

    generateId(hotels) {
        if (!hotels.length) {
            return 1;
        }
        const maxId = Math.max(...hotels.map(hotel => Number(hotel.id) || 0));
        return maxId + 1;
    },

    upsertHotel(hotel) {
        const hotels = this.getHotels();
        const id = hotel.id ? Number(hotel.id) : this.generateId(hotels);
        const payload = { ...hotel, id: id };
        const index = hotels.findIndex(item => Number(item.id) === id);

        if (index >= 0) {
            hotels[index] = payload;
        } else {
            hotels.push(payload);
        }

        this.saveHotels(hotels);
        return id;
    },

    deleteHotel(id) {
        const numericId = Number(id);
        const hotels = this.getHotels().filter(hotel => Number(hotel.id) !== numericId);
        this.saveHotels(hotels);
    }
};
