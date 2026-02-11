/*
 * ============================================
 * InnStay - Authentication Module
 * Author: InnStay Team
 * Description: Handles user login, registration and authentication
 * ============================================
 */

/**
 * Auth object - Handles all authentication related operations
 * @namespace Auth
 */
const Auth = {
    /**
     * Initialize authentication module
     * Sets up event listeners for login/registration forms
     */
    init() {
        console.log('Initializing Auth module...');
        
        // Login form setup
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.setupPasswordToggle();
        }

        // Registration form setup
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            this.setupPasswordValidation();
        }

        console.log('✓ Auth module initialized');
    },

    /**
     * Handle login form submission
     * Validates credentials and authenticates user
     * @param {Event} event - Form submission event
     */
    handleLogin(event) {
        event.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorDiv = document.getElementById('loginError');

        // Validate email
        if (!Utils.isValidEmail(email)) {
            this.showLoginError('Please enter a valid email address');
            return;
        }

        // Validate password
        if (password.length === 0) {
            this.showLoginError('Please enter your password');
            return;
        }

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual backend call)
        setTimeout(() => {
            // Mock authentication
            const user = {
                id: 1,
                email: email,
                name: email.split('@')[0],
                role: 'user'
            };

            // Save user session
            Utils.saveToStorage('currentUser', user);
            
            if (rememberMe) {
                Utils.saveToStorage('rememberEmail', email);
            }

            // Show success message
            errorDiv.style.display = 'none';
            InnStay.showAlert('Login successful! Redirecting...', 'success', 2000);

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 1000);
    },

    /**
     * Handle registration form submission
     * Creates new user account
     * @param {Event} event - Form submission event
     */
    handleRegister(event) {
        event.preventDefault();

        // Get form values
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('agreeTerms').checked;

        // Validate inputs
        if (!name) {
            this.showError('registerError', 'Please enter your full name');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            this.showError('registerError', 'Please enter a valid email address');
            return;
        }

        // Validate password
        const passwordValidation = Utils.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showError('registerError', passwordValidation.feedback[0]);
            return;
        }

        if (password !== confirmPassword) {
            this.showError('registerError', 'Passwords do not match');
            return;
        }

        if (!terms) {
            this.showError('registerError', 'You must agree to the terms and conditions');
            return;
        }

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Mock user creation
            const newUser = {
                id: Math.random(),
                name: name,
                email: email,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            // Save user session
            Utils.saveToStorage('currentUser', newUser);

            // Show success
            InnStay.showAlert('Account created successfully! Redirecting...', 'success', 2000);

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 1000);
    },

    /**
     * Toggle password visibility
     * Shows/hides password input field
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
     * Setup password validation feedback for registration
     * Shows password strength indicator
     */
    setupPasswordValidation() {
        const passwordInput = document.getElementById('password');
        const strengthDiv = document.getElementById('passwordStrength');

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const validation = Utils.validatePassword(passwordInput.value);
                
                if (strengthDiv) {
                    strengthDiv.innerHTML = '';
                    
                    // Show feedback messages
                    validation.feedback.forEach(msg => {
                        const p = document.createElement('small');
                        p.className = 'text-danger d-block';
                        p.textContent = '✗ ' + msg;
                        strengthDiv.appendChild(p);
                    });

                    // Show strength meter
                    if (passwordInput.value.length > 0) {
                        const strengthBar = document.createElement('div');
                        strengthBar.className = 'progress mt-2';
                        strengthBar.innerHTML = `
                            <div class="progress-bar ${this.getStrengthClass(validation.score)}" 
                                 style="width: ${(validation.score / 4) * 100}%">
                            </div>
                        `;
                        strengthDiv.appendChild(strengthBar);
                    }
                }
            });
        }
    },

    /**
     * Get CSS class for password strength
     * @param {Number} score - Password strength score (0-4)
     * @returns {String} Bootstrap class name
     */
    getStrengthClass(score) {
        if (score <= 1) return 'bg-danger';
        if (score === 2) return 'bg-warning';
        if (score === 3) return 'bg-info';
        return 'bg-success';
    },

    /**
     * Show login error message
     * @param {String} message - Error message to display
     */
    showLoginError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Show error message in specified container
     * @param {String} elementId - ID of error container
     * @param {String} message - Error message to display
     */
    showError(elementId, message) {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Logout user
     * Clears user session and redirects to home
     */
    logout() {
        Utils.removeFromStorage('currentUser');
        Utils.removeFromStorage('rememberEmail');
        InnStay.showAlert('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    },

    /**
     * Check if user is authenticated
     * @returns {Boolean|Object} User object if authenticated, false otherwise
     */
    getCurrentUser() {
        return Utils.getFromStorage('currentUser') || false;
    },

    /**
     * Check if user has admin role
     * @returns {Boolean} True if user is admin
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    /**
     * Require authentication for a page
     * Redirects to login if not authenticated
     */
    requireLogin() {
        if (!this.getCurrentUser()) {
            InnStay.showAlert('Please log in to access this page', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
};

/**
 * Initialize auth module when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

console.log('Auth module loaded successfully');
