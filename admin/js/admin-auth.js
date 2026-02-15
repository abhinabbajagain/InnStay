document.addEventListener('DOMContentLoaded', function () {
    if (typeof Utils === 'undefined') {
        return;
    }

    const page = document.body.getAttribute('data-page');
    const isLoginPage = page === 'login';
    const token = localStorage.getItem('authToken');
    const apiBaseUrl = 'http://localhost:5000/api';

    if (isLoginPage) {
        return;
    }

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(`${apiBaseUrl}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(result => {
            if (!result.ok || !result.data.user || result.data.user.role !== 'admin') {
                Utils.removeFromStorage('adminUser');
                Utils.removeFromStorage('currentUser');
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
                return;
            }
            Utils.saveToStorage('adminUser', result.data.user);
        })
        .catch(() => {
            Utils.removeFromStorage('adminUser');
            Utils.removeFromStorage('currentUser');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        });
});
