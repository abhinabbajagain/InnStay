/*
 * ============================================
 * InnStay - Utility Functions
 * Author: InnStay Team
 * Description: Helper functions and utilities
 * ============================================
 */

/**
 * Utility object containing helper functions
 * @namespace Utils
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
     * Requirements: At least 8 characters, 1 uppercase, 1 number
     * @param {String} password - Password to validate
     * @returns {Object} Validation result with score and feedback
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

        if (!/[!@#$%^&*]/.test(password)) {
            result.feedback.push('Password should contain special character');
        } else {
            result.score += 1;
        }

        return result;
    },

    /**
     * Trim and sanitize user input
     * @param {String} input - User input to sanitize
     * @returns {String} Sanitized input
     */
    sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    },

    /**
     * Generate random ID
     * @returns {String} Random ID
     */
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - DOM element to check
     * @returns {Boolean} True if element is visible
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Debounce function for search inputs
     * @param {Function} func - Function to debounce
     * @param {Number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Clone an object deeply
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Sort array of objects by property
     * @param {Array} array - Array to sort
     * @param {String} property - Property to sort by
     * @param {String} order - 'asc' or 'desc'
     * @returns {Array} Sorted array
     */
    sortByProperty(array, property, order = 'asc') {
        return array.sort((a, b) => {
            if (order === 'asc') {
                return a[property] > b[property] ? 1 : -1;
            } else {
                return a[property] < b[property] ? 1 : -1;
            }
        });
    },

    /**
     * Get URL query parameters
     * @returns {Object} Query parameters as key-value pairs
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
    },

    /**
     * Save data to localStorage
     * @param {String} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
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
     * @returns {*} Stored value (parsed from JSON)
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
     * @param {String} key - Storage key to remove
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

// Log that utilities have loaded
console.log('Utility functions loaded successfully');
