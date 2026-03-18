document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('adminLoginForm');
    const errorDiv = document.getElementById('adminError');
    const toggleBtn = document.getElementById('adminTogglePassword');
    const passwordInput = document.getElementById('adminPassword');
    const closeBtn = document.querySelector('[data-close-auth]');

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

    if (!form) {
        return;
    }

    // Load remembered email
    const remembered = localStorage.getItem('adminRemember');
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
            showError('Please enter your admin email and password.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitBtn.disabled = true;
        }

        try {
            let result = null;

            // Try backend first
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    timeout: 3000
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user && data.user.role === 'admin') {
                        result = data;
                    }
                }
            } catch (e) {
                // Backend unavailable, use demo mode
            }

            // Fallback to demo authentication
            if (!result && typeof AdminData !== 'undefined') {
                result = AdminData.authenticate(email, password);
                if (result.success) {
                    result = {
                        token: result.token,
                        user: result.user
                    };
                } else {
                    result = null;
                }
            }

            if (!result || !result.user || result.user.role !== 'admin') {
                showError('Invalid admin credentials. Try admin@innstay.com / admin123');
                return;
            }

            // Store authentication
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('adminUser', JSON.stringify(result.user));
            localStorage.setItem('currentUser', JSON.stringify(result.user));

            if (remember) {
                localStorage.setItem('adminRemember', email);
            }

            errorDiv.style.display = 'none';
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Admin login failed:', error);
            showError('Unable to sign in right now. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
});

