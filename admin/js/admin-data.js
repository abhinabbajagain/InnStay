/*
 * ============================================
 * InnStay - Admin Demo Data
 * Description: Demo data for admin panel when backend is unavailable
 * ============================================
 */

const AdminData = {
    // Demo admin accounts
    admins: [
        { id: 1, name: 'Admin User', email: 'admin@innstay.com', password: 'admin123', role: 'admin' },
        { id: 2, name: 'Manager', email: 'manager@innstay.com', password: 'manager123', role: 'manager' }
    ],

    // Demo hotels
    hotels: [
        {
            id: 1,
            title: 'Harbor View Suites',
            location: 'Sydney, Australia',
            price: 150,
            rating: 4.8,
            reviews: 156,
            image: '#667eea',
            beds: 2,
            bathrooms: 1,
            guests: 4,
            available: true,
            revenue: '$12,450'
        },
        {
            id: 2,
            title: 'Skyline Loft',
            location: 'New York, USA',
            price: 200,
            rating: 4.7,
            reviews: 203,
            image: '#764ba2',
            beds: 1,
            bathrooms: 1,
            guests: 2,
            available: true,
            revenue: '$15,600'
        },
        {
            id: 3,
            title: 'Garden Retreat',
            location: 'Bangkok, Thailand',
            price: 80,
            rating: 4.9,
            reviews: 189,
            image: '#667eea',
            beds: 3,
            bathrooms: 2,
            guests: 6,
            available: true,
            revenue: '$9,200'
        },
        {
            id: 4,
            title: 'Mountain Cabin',
            location: 'Colorado, USA',
            price: 120,
            rating: 4.6,
            reviews: 98,
            image: '#764ba2',
            beds: 2,
            bathrooms: 1,
            guests: 4,
            available: false,
            revenue: '$7,800'
        }
    ],

    // Demo users
    users: [
        {
            id: 1,
            name: 'Emma Johnson',
            email: 'emma@example.com',
            phone: '+61 2 xxx xxxx',
            role: 'Guest',
            joined: 'Feb 10, 2025',
            bookings: 5,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Michael Lee',
            email: 'michael@example.com',
            phone: '+1 212 xxx xxxx',
            role: 'Host',
            joined: 'Jan 5, 2025',
            bookings: 12,
            status: 'Active'
        },
        {
            id: 3,
            name: 'Sarah Patel',
            email: 'sarah@example.com',
            phone: '+66 2 xxx xxxx',
            role: 'Guest',
            joined: 'Feb 1, 2025',
            bookings: 2,
            status: 'Active'
        },
        {
            id: 4,
            name: 'David Smith',
            email: 'david@example.com',
            phone: '+1 720 xxx xxxx',
            role: 'Host',
            joined: 'Dec 15, 2024',
            bookings: 8,
            status: 'Active'
        }
    ],

    // Demo bookings
    bookings: [
        {
            id: 'BK001',
            guest: 'Emma Johnson',
            hotel: 'Harbor View Suites',
            dates: 'Feb 20 - Feb 24',
            status: 'Confirmed',
            price: '$750',
            guests: 2
        },
        {
            id: 'BK002',
            guest: 'Michael Lee',
            hotel: 'Skyline Loft',
            dates: 'Feb 18 - Feb 22',
            status: 'Pending',
            price: '$800',
            guests: 2
        },
        {
            id: 'BK003',
            guest: 'Sarah Patel',
            hotel: 'Garden Retreat',
            dates: 'Feb 27 - Mar 2',
            status: 'Confirmed',
            price: '$240',
            guests: 4
        },
        {
            id: 'BK004',
            guest: 'James Wilson',
            hotel: 'Mountain Cabin',
            dates: 'Mar 1 - Mar 5',
            status: 'Cancelled',
            price: '$480',
            guests: 3
        },
        {
            id: 'BK005',
            guest: 'Lisa Anderson',
            hotel: 'Harbor View Suites',
            dates: 'Mar 10 - Mar 15',
            status: 'Pending',
            price: '$750',
            guests: 2
        }
    ],

    // Demo reviews
    reviews: [
        {
            id: 'RV001',
            hotel: 'Harbor View Suites',
            guest: 'Emma Johnson',
            rating: 5,
            title: 'Amazing view and great service',
            text: 'The location is perfect with a stunning harbor view. Staff was very attentive and helpful.',
            date: 'Feb 24, 2025'
        },
        {
            id: 'RV002',
            hotel: 'Skyline Loft',
            guest: 'Michael Lee',
            rating: 4,
            title: 'Great location, would recommend',
            text: 'Perfect for exploring the city. Close to all major attractions.',
            date: 'Feb 22, 2025'
        },
        {
            id: 'RV003',
            hotel: 'Garden Retreat',
            guest: 'Sarah Patel',
            rating: 5,
            title: 'Paradise found!',
            text: 'Beautiful garden, peaceful surroundings, and delicious breakfast.',
            date: 'Feb 28, 2025'
        },
        {
            id: 'RV004',
            hotel: 'Mountain Cabin',
            guest: 'James Wilson',
            rating: 4,
            title: 'Cozy and comfortable',
            text: 'Great cabin for a mountain getaway. Fireplace was perfect for cold nights.',
            date: 'Dec 10, 2024'
        }
    ],

    // Statistics
    statistics: {
        totalBookings: 2384,
        totalRevenue: '$54,200',
        averageRating: 4.7,
        activeHotels: 184,
        totalGuests: 1256,
        totalHosts: 189
    },

    // Mock authentication
    authenticate(email, password) {
        const admin = this.admins.find(a => a.email === email && a.password === password);
        if (admin) {
            return {
                success: true,
                token: 'demo_token_' + Date.now(),
                user: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            };
        }
        return { success: false };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminData;
}
