document.addEventListener('DOMContentLoaded', function () {
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
                        <div class="admin-avatar">A</div>
                        <span>Admin</span>
                    </div>
                    <button class="logout-btn" type="button">Logout</button>
                </div>
            </header>
        `;
    }

    const adminUser = typeof Utils !== 'undefined' ? Utils.getFromStorage('adminUser') : null;
    if (adminUser) {
        const nameLabel = document.querySelector('.admin-user span');
        const avatar = document.querySelector('.admin-avatar');
        if (nameLabel) {
            nameLabel.textContent = adminUser.name || 'Admin';
        }
        if (avatar) {
            avatar.textContent = (adminUser.name || 'A').charAt(0).toUpperCase();
        }
    }

    const toggleBtn = document.getElementById('sidebarToggle');
    const aside = document.querySelector('.admin-sidebar');

    if (toggleBtn && aside) {
        toggleBtn.addEventListener('click', function () {
            aside.classList.toggle('show');
        });
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn && typeof Utils !== 'undefined') {
        logoutBtn.addEventListener('click', function () {
            Utils.removeFromStorage('adminUser');
            window.location.href = 'login.html';
        });
    }
});
