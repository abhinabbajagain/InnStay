/*
 * ============================================
 * InnStay - Admin Authentication Module
 * Description: Core authentication checking and helper functions
 * ============================================
 */

// Check if user is authenticated
function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const adminUser = localStorage.getItem('adminUser');
    
    return {
        isAuthenticated: !!(authToken && adminUser),
        token: authToken,
        user: adminUser ? JSON.parse(adminUser) : null
    };
}

// Ensure user is authenticated before showing page
function ensureAuth() {
    const auth = checkAuthentication();
    
    // If not authenticated, auto-populate with demo admin user (no login required)
    if (!auth.isAuthenticated) {
        const demoToken = 'demo-admin-token-' + Date.now();
        const demoUser = {
            id: 'admin-001',
            name: 'Admin',
            email: 'admin@innstay.com',
            role: 'admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        };
        
        localStorage.setItem('authToken', demoToken);
        localStorage.setItem('adminUser', JSON.stringify(demoUser));
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        
        return {
            isAuthenticated: true,
            token: demoToken,
            user: demoUser
        };
    }
    
    return auth;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClass = 
        status.toLowerCase().includes('confirmed') || status.toLowerCase().includes('active') ? 'success' :
        status.toLowerCase().includes('pending') ? 'warning' :
        status.toLowerCase().includes('cancelled') || status.toLowerCase().includes('rejected') ? 'danger' :
        'info';
    
    return `<span class="badge badge-${statusClass}">${status}</span>`;
}

// Get rating stars
function getStarRating(rating) {
    const stars = Math.round(rating || 0);
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += i < stars ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
    return html;
}

// Search in data array
function searchData(data, query, fields) {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(item => 
        fields.some(field => 
            String(item[field]).toLowerCase().includes(q)
        )
    );
}

// Sort data array
function sortData(data, field, direction = 'asc') {
    return [...data].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (typeof aVal === 'string') {
            return direction === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        
        return direction === 'asc' 
            ? aVal - bVal
            : bVal - aVal;
    });
}

// Paginate data
function paginateData(data, page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
        data: data.slice(start, end),
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
        totalItems: data.length
    };
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid fa-${type === 'success' ? 'check' : type === 'error' ? 'xmark' : 'exclamation'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => notification.remove(), 4000);
}

// Confirm dialog
function confirmDialog(message) {
    return confirm(message);
}

// Form validation
function validateForm(form) {
    const formData = new FormData(form);
    const errors = [];
    
    for (let [key, value] of formData) {
        if (!value) {
            errors.push(`${key} is required`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Get form data as object
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData) {
        data[key] = value;
    }
    return data;
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Get count statistics
function getStatistics(adminData) {
    if (!adminData) return null;
    
    return {
        totalHotels: adminData.hotels?.length || 0,
        totalUsers: adminData.users?.length || 0,
        totalBookings: adminData.bookings?.length || 0,
        totalReviews: adminData.reviews?.length || 0,
        confirmedBookings: adminData.bookings?.filter(b => b.status === 'Confirmed').length || 0,
        activeHotels: adminData.hotels?.filter(h => h.available).length || 0,
        avgRating: adminData.reviews?.length > 0 
            ? (adminData.reviews.reduce((sum, r) => sum + r.rating, 0) / adminData.reviews.length).toFixed(1)
            : 0
    };
}
