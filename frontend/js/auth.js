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

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            this.setupPasswordToggle();
            this.setupPasswordValidation();
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
     * Handle registration form submission
     * @param {Event} event - Form submission event
     */
    handleRegister(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate full name
        if (!fullName) {
            this.showRegisterError('Please enter your full name');
            return;
        }

        // Validate email
        if (!Utils.isValidEmail(email)) {
            this.showRegisterError('Please enter a valid email address');
            return;
        }

        // Validate password
        const passwordValidation = Utils.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showRegisterError(passwordValidation.feedback[0]);
            return;
        }

        // Check passwords match
        if (password !== confirmPassword) {
            this.showRegisterError('Passwords do not match');
            return;
        }

        // Check terms agreed
        if (!agreeTerms) {
            this.showRegisterError('You must agree to the terms and conditions');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const newUser = {
                id: Math.random(),
                fullName: fullName,
                email: email,
                phone: phone,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            Utils.saveToStorage('currentUser', newUser);
            document.getElementById('registerError').style.display = 'none';

            InnStay.showAlert('Account created successfully! Redirecting...', 'success', 2000);

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
     * Setup password validation feedback for registration
     */
    setupPasswordValidation() {
        const passwordInput = document.getElementById('password');
        const strengthDiv = document.getElementById('passwordStrength');

        if (passwordInput && strengthDiv) {
            passwordInput.addEventListener('input', () => {
                const validation = Utils.validatePassword(passwordInput.value);
                
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
                    strengthBar.className = 'progress';
                    const barClass = this.getStrengthClass(validation.score);
                    strengthBar.innerHTML = `
                        <div class="progress-bar ${barClass}" 
                             style="width: ${(validation.score / 4) * 100}%">
                        </div>
                    `;
                    strengthDiv.appendChild(strengthBar);
                }
            });
        }
    },

    /**
     * Get CSS class for password strength
     * @param {Number} score - Password strength score (0-4)
     * @returns {String} CSS class name
     */
    getStrengthClass(score) {
        if (score <= 1) return 'bg-danger';
        if (score === 2) return 'bg-warning';
        if (score === 3) return 'bg-info';
        return 'bg-success';
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
     * Show register error
     * @param {String} message - Error message
     */
    showRegisterError(message) {
        const errorDiv = document.getElementById('registerError');
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
