/*
 * ============================================
 * InnStay - Admin Navigation & Auth Module
 * Description: Handle admin sidebar, header, and authentication
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    checkAdminAuth();

    const sidebar = document.getElementById('adminSidebar');
    const header = document.getElementById('adminHeader');
    const page = document.body.getAttribute('data-page');

    if (sidebar) {
        sidebar.innerHTML = `
            <aside class="admin-sidebar">
                <div class="admin-logo">
                    <h2>InnStay Admin</h2>
                    <p>Control Center</p>
                </div>
                <nav>
                    <ul class="admin-nav">
                        <li><a class="admin-nav-link ${page === 'dashboard' ? 'active' : ''}" href="index.html"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
                        <li><a class="admin-nav-link ${page === 'hotels' ? 'active' : ''}" href="hotels.html"><i class="fa-solid fa-hotel"></i> Hotels</a></li>
                        <li><a class="admin-nav-link ${page === 'users' ? 'active' : ''}" href="users.html"><i class="fa-solid fa-users"></i> Users</a></li>
                        <li><a class="admin-nav-link ${page === 'bookings' ? 'active' : ''}" href="bookings.html"><i class="fa-solid fa-calendar-check"></i> Bookings</a></li>
                        <li><a class="admin-nav-link ${page === 'reviews' ? 'active' : ''}" href="reviews.html"><i class="fa-solid fa-star"></i> Reviews</a></li>
                        <li><a class="admin-nav-link ${page === 'settings' ? 'active' : ''}" href="settings.html"><i class="fa-solid fa-gear"></i> Settings</a></li>
                    </ul>
                </nav>
            </aside>
        `;
    }

    if (header) {
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{"name":"Admin"}');
        const userName = adminUser?.name || 'Admin';
        const userInitial = (userName || 'A').charAt(0).toUpperCase();

        header.innerHTML = `
            <header class="admin-header">
                <div class="admin-header-left">
                    <button class="admin-toggle" id="sidebarToggle" aria-label="Toggle navigation">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div class="admin-header-title">
                        <h1>${page ? page.charAt(0).toUpperCase() + page.slice(1) : 'Dashboard'}</h1>
                        <p>InnStay Admin Panel</p>
                    </div>
                </div>
                <div class="admin-header-right">
                    <div class="admin-user">
                        <div class="admin-avatar">${userInitial}</div>
                        <span>${userName}</span>
                    </div>
                    <button class="logout-btn" type="button">Logout</button>
                </div>
            </header>
        `;

        // Setup sidebar toggle
        const toggleBtn = document.getElementById('sidebarToggle');
        const aside = document.querySelector('.admin-sidebar');
        if (toggleBtn && aside) {
            toggleBtn.addEventListener('click', function () {
                aside.classList.toggle('show');
            });
        }

        // Setup logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                localStorage.removeItem('adminUser');
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            });
        }
    }
});

function checkAdminAuth() {
    const authToken = localStorage.getItem('authToken');
    const adminUser = localStorage.getItem('adminUser');
    
    // Allow access if authenticated OR on login page
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!authToken || !adminUser) {
        if (!isLoginPage) {
            window.location.href = 'login.html';
        }
    }
}

// Helper to get admin data
function getAdminData() {
    return typeof AdminData !== 'undefined' ? AdminData : null;
}

// Helper to render table rows
function renderTableRows(data, columns, actions = null) {
    return data.map((item, index) => {
        const cells = columns.map(col => {
            const value = item[col.key];
            if (col.render) {
                return `<td>${col.render(value, item)}</td>`;
            }
            if (col.type === 'badge') {
                const badgeClass = `badge-${getStatusClass(value)}`;
                return `<td><span class="badge ${badgeClass}">${value}</span></td>`;
            }
            return `<td>${value || '-'}</td>`;
        }).join('');

        const actionButtons = actions ? `<td>${actions(item, index)}</td>` : '';
        return `<tr>${cells}${actionButtons}</tr>`;
    }).join('');
}

function getStatusClass(status) {
    const st = status.toLowerCase();
    if (st.includes('confirmed') || st.includes('active')) return 'success';
    if (st.includes('pending')) return 'warning';
    if (st.includes('cancelled')) return 'danger';
    return 'info';
}

// Show/hide modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

