/*
 * ============================================
 * InnStay - Authentication Module
 * Description: Handles user login/registration
 * ============================================
 */

const Auth = {
    /**
     * Initialize authentication module
     */
    init() {
        console.log('Initializing Auth module...');
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.setupPasswordToggle();
        }

        console.log('✓ Auth module initialized');
    },

    /**
     * Handle login form submission
     * @param {Event} event - Form submission event
     */
    handleLogin(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorDiv = document.getElementById('loginError');

        if (!Utils.isValidEmail(email)) {
            this.showLoginError('Please enter a valid email address');
            return;
        }

        if (password.length === 0) {
            this.showLoginError('Please enter your password');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const user = {
                id: 1,
                email: email,
                name: email.split('@')[0],
                role: 'user'
            };

            Utils.saveToStorage('currentUser', user);
            
            if (rememberMe) {
                Utils.saveToStorage('rememberEmail', email);
            }

            errorDiv.style.display = 'none';
            InnStay.showAlert('Login successful! Redirecting...', 'success', 2000);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 1000);
    },

    /**
     * Toggle password visibility
     */
    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                toggleBtn.querySelector('i').classList.toggle('fa-eye');
                toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    },

    /**
     * Show login error
     * @param {String} message - Error message
     */
    showLoginError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Check if user is authenticated
     * @returns {Boolean|Object} User object or false
     */
    getCurrentUser() {
        return Utils.getFromStorage('currentUser') || false;
    },

    /**
     * Logout user
     */
    logout() {
        Utils.removeFromStorage('currentUser');
        Utils.removeFromStorage('rememberEmail');
        InnStay.showAlert('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
};

/**
 * Initialize auth when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

console.log('Auth module loaded');
