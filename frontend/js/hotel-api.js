const HotelAPI = {
    baseUrl: 'http://localhost:5000/api',
    placeholderImage: 'https://via.placeholder.com/800x600?text=InnStay+Hotel',

    getAuthToken() {
        try {
            return localStorage.getItem('authToken') || '';
        } catch (error) {
            console.error('Failed to read auth token:', error);
            return '';
        }
    },

    getAuthHeaders() {
        const token = this.getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    async request(path, options = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'API request failed');
        }

        return response.json();
    },

    async listHotels(params = {}) {
        const query = new URLSearchParams(params).toString();
        const data = await this.request(`/hotels${query ? `?${query}` : ''}`);
        return data.hotels || [];
    },

    async getHotel(id) {
        const data = await this.request(`/hotels/${id}`);
        return data.hotel || null;
    },

    async listAdminHotels() {
        const data = await this.request('/admin/hotels');
        return data.hotels || [];
    },

    async createHotel(payload) {
        const data = await this.request('/admin/hotels', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return data.hotel;
    },

    async updateHotel(id, payload) {
        const data = await this.request(`/admin/hotels/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        return data.hotel;
    },

    async deleteHotel(id) {
        await this.request(`/admin/hotels/${id}`, { method: 'DELETE' });
    },

    getSafeImageUrl(url) {
        const clean = (url || '').toString().trim();
        return clean ? clean : this.placeholderImage;
    }
};
