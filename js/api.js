// API Service for Project Inscape
// Handles all communication with PHP backend

class InscapeAPI {
    constructor() {
        this.baseURL = '/api'; // Adjust this to your PHP API path
    }

    // Generic fetch method with error handling
    async fetchAPI(endpoint, params = {}) {
        try {
            const url = new URL(this.baseURL + endpoint, window.location.origin);
            
            // Add query parameters
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get all states
    async getStates(search = '', limit = 50, offset = 0) {
        return await this.fetchAPI('/get_states.php', {
            search: search,
            limit: limit,
            offset: offset
        });
    }

    // Get districts by state ID
    async getDistricts(stateId, search = '', limit = 50, offset = 0) {
        return await this.fetchAPI('/get_districts.php', {
            state_id: stateId,
            search: search,
            limit: limit,
            offset: offset
        });
    }

    // Get places by district ID
    async getPlaces(districtId, category = '', search = '', minRating = 0, limit = 50, offset = 0) {
        return await this.fetchAPI('/get_places.php', {
            district_id: districtId,
            category: category,
            search: search,
            min_rating: minRating,
            limit: limit,
            offset: offset
        });
    }

    // Search across states, districts, and places
    async search(query, type = 'all', limit = 20, offset = 0) {
        return await this.fetchAPI('/search.php', {
            q: query,
            type: type,
            limit: limit,
            offset: offset
        });
    }

    // Get featured states (top rated or popular)
    async getFeaturedStates(limit = 6) {
        const response = await this.getStates('', limit, 0);
        return response.data.slice(0, limit);
    }

    // Get popular places across all districts
    async getPopularPlaces(limit = 8) {
        // This would need a separate API endpoint for popular places
        // For now, we'll get places from a few districts
        const states = await this.getStates('', 5, 0);
        const popularPlaces = [];
        
        for (const state of states.data) {
            const districts = await this.getDistricts(state.id, '', 2, 0);
            
            for (const district of districts.data) {
                const places = await this.getPlaces(district.id, '', '', 4.0, 2, 0);
                popularPlaces.push(...places.data);
                
                if (popularPlaces.length >= limit) break;
            }
            
            if (popularPlaces.length >= limit) break;
        }
        
        return popularPlaces.slice(0, limit);
    }

    // Get categories for filtering
    async getCategories() {
        // This would need a separate API endpoint
        // For now, return static categories
        return [
            'Temple', 'Beach', 'Fort', 'Palace', 'Museum', 
            'Park', 'Lake', 'Monument', 'Wildlife', 'Historical'
        ];
    }
}

// Create global API instance
const api = new InscapeAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InscapeAPI;
} 