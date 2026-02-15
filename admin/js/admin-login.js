document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('adminLoginForm');
    const errorDiv = document.getElementById('adminError');
    const toggleBtn = document.getElementById('adminTogglePassword');
    const passwordInput = document.getElementById('adminPassword');
    const closeBtn = document.querySelector('[data-close-auth]');
    const apiBaseUrl = 'http://localhost:5000/api';

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            window.location.href = '../frontend/index.html';
        });
    }

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.querySelector('i').classList.toggle('fa-eye');
            toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    if (!form || typeof Utils === 'undefined') {
        return;
    }

    const remembered = Utils.getFromStorage('adminRemember');
    if (remembered) {
        document.getElementById('adminEmail').value = remembered;
        document.getElementById('adminRemember').checked = true;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        const remember = document.getElementById('adminRemember').checked;

        if (!email || !password) {
            errorDiv.textContent = 'Please enter your admin email and password.';
            errorDiv.style.display = 'block';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                errorDiv.textContent = data.message || 'Unable to sign in. Please check your credentials.';
                errorDiv.style.display = 'block';
                return;
            }

            if (!data.user || data.user.role !== 'admin') {
                errorDiv.textContent = 'Admin access required.';
                errorDiv.style.display = 'block';
                return;
            }

            localStorage.setItem('authToken', data.token);
            Utils.saveToStorage('adminUser', data.user);
            Utils.saveToStorage('currentUser', data.user);

            if (remember) {
                Utils.saveToStorage('adminRemember', email);
            }

            errorDiv.style.display = 'none';
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Admin login failed:', error);
            errorDiv.textContent = 'Unable to sign in right now. Please try again.';
            errorDiv.style.display = 'block';
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});
