/*
 * ============================================
 * InnStay - Shared Navigation Module
 * Description: Navbar menu toggle and auth UI
 *              for all pages except index/search
 *              (which use main.js)
 * ============================================
 */
document.addEventListener('DOMContentLoaded', function () {
    initNav();
});

function initNav() {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = menuDropdown.classList.toggle('show');
            menuBtn.classList.toggle('open', isOpen);
        });
    }

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.user-nav')) {
            if (menuDropdown) menuDropdown.classList.remove('show');
            if (menuBtn) menuBtn.classList.remove('open');
        }
    });

    document.querySelectorAll('[data-auth="logout"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            try { localStorage.removeItem('currentUser'); } catch (_) {}
            try { localStorage.removeItem('rememberEmail'); } catch (_) {}
            const inPages = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
            window.location.href = inPages ? '../index.html' : 'index.html';
        });
    });

    updateNavAuthUI();
}

function updateNavAuthUI() {
    let user = null;
    try {
        const stored = localStorage.getItem('currentUser');
        user = stored ? JSON.parse(stored) : null;
    } catch (_) {}

    const guestNavs = document.querySelectorAll('[data-auth="guestNav"]');
    const userNavs  = document.querySelectorAll('[data-auth="userNav"]');

    if (user) {
        guestNavs.forEach(el => el.hidden = true);
        userNavs.forEach(el => {
            el.hidden = false;
            const label = el.querySelector('.menu-label');
            if (label) {
                const firstName = (user.fullName || user.name || 'User').split(' ')[0];
                label.textContent = 'Hi, ' + firstName;
            }
        });
    } else {
        guestNavs.forEach(el => el.hidden = false);
        userNavs.forEach(el => el.hidden = true);
    }
}
