/*
 * ============================================
 * InnStay - Utility Functions
 * Description: Helper functions and utilities
 * ============================================
 */

const Utils = {
    /**
     * Validate email format
     * @param {String} email - Email address to validate
     * @returns {Boolean} True if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate password strength
     * @param {String} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword(password) {
        const result = {
            isValid: true,
            score: 0,
            feedback: []
        };

        if (password.length < 8) {
            result.feedback.push('Password must be at least 8 characters');
            result.isValid = false;
        } else {
            result.score += 1;
        }

        if (!/[A-Z]/.test(password)) {
            result.feedback.push('Password must contain uppercase letter');
            result.isValid = false;
        } else {
            result.score += 1;
        }

        if (!/[0-9]/.test(password)) {
            result.feedback.push('Password must contain a number');
            result.isValid = false;
        } else {
            result.score += 1;
        }

        return result;
    },

    /**
     * Save data to localStorage
     * @param {String} key - Storage key
     * @param {*} value - Value to store
     */
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Get data from localStorage
     * @param {String} key - Storage key
     * @returns {*} Stored value
     */
    getFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     * @param {String} key - Storage key
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    /**
     * Get URL query parameters
     * @returns {Object} Query parameters
     */
    getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');

        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });

        return params;
    }
};

console.log('Utility functions loaded successfully');
