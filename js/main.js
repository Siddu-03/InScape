// ===== MAIN JAVASCRIPT =====

// Global variables
let currentState = null;
let currentDistrict = null;
let searchTimeout = null;

// Global variables for search pagination
let currentSearchQuery = '';
let currentSearchOffset = 0;
let currentSearchResults = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeSearch();
    initializeAnimations();
    
    // Load data based on current page
    const currentPage = getCurrentPage();
    if (currentPage === 'home') {
        loadHomePageData();
    } else if (currentPage === 'map') {
        loadMapData();
    } else if (currentPage === 'state') {
        loadStatePageData();
    }
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-menu')) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .step-card, .trivia-card, .insight-card, .faq-item, .featured-card, .festival-card').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    
    // Only initialize if not already done and we're not on the map page
    if (searchInput && !searchInput.dataset.initialized && !document.querySelector('.map-search-container')) {
        console.log('Initializing main search function'); // Debug log
        
        // Mark as initialized to prevent double initialization
        searchInput.dataset.initialized = 'true';
        
        // Handle form submission only - no input event listener
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault(); // This prevents page reload
                const query = searchInput.value.trim();
                console.log('Main search form submitted:', query); // Debug log
                if (query) {
                    performSearch(query);
                }
            });
        }
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSearchResults();
            }
        });
    }
}

// Perform search using API
async function performSearch(query, offset = 0) {
    try {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;
        
        // Show loading
        if (offset === 0) {
            searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
            searchResults.style.display = 'block';
            currentSearchQuery = query;
            currentSearchOffset = 0;
            currentSearchResults = [];
        }
        
        // Check if API is available
        if (typeof api === 'undefined') {
            searchResults.innerHTML = '<div class="search-no-results">Search temporarily unavailable</div>';
            return;
        }
        
        // Call API
        const response = await api.search(query, 'all', 50, offset);
        
        if (response.success && response.data.length > 0) {
            if (offset === 0) {
                // First search - replace results
                currentSearchResults = response.data;
                displaySearchResults(response.data, response.pagination);
            } else {
                // Load more - append results
                currentSearchResults = currentSearchResults.concat(response.data);
                displaySearchResults(currentSearchResults, response.pagination);
            }
            currentSearchOffset = offset + response.data.length;
        } else {
            if (offset === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        }
    }
}

// Load more search results
function loadMoreSearchResults() {
    if (currentSearchQuery) {
        performSearch(currentSearchQuery, currentSearchOffset);
    }
}

// Display search results
function displaySearchResults(results, pagination = null) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    let html = '';
    
    results.forEach(item => {
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        const location = item.state_name || item.district_name || '';
        
        html += `
            <div class="search-result-item" data-type="${item.type}" data-id="${item.id}">
                <div class="search-result-icon">${getTypeIcon(item.type)}</div>
                <div class="search-result-content">
                    <div class="search-result-title">${item.name}</div>
                    <div class="search-result-subtitle">${typeLabel}${location ? ` • ${location}` : ''}</div>
                </div>
            </div>
        `;
    });
    
    // Add "Show More" button if there are more results
    if (pagination && pagination.has_more) {
        html += `
            <div class="search-show-more">
                <button class="show-more-btn" onclick="loadMoreSearchResults()">
                    Show More Results (${pagination.total - results.length} more)
                </button>
            </div>
        `;
    }
    
    searchResults.innerHTML = html;
    
    // Add click handlers
    const resultItems = searchResults.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', function() {
            const type = this.dataset.type;
            const id = this.dataset.id;
            handleSearchResultClick(type, id);
        });
    });
}

// Handle search result click
function handleSearchResultClick(type, id) {
    if (type === 'state') {
        window.location.href = `state.html?state=${id}`;
    } else if (type === 'district') {
        window.location.href = `state.html?district=${id}`;
    } else if (type === 'place') {
        // Show place details in modal or navigate to district page
        window.location.href = `state.html?place=${id}`;
    }
    
    hideSearchResults();
}

// Hide search results
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Get icon for search result type
function getTypeIcon(type) {
    const icons = {
        state: '🏛️',
        district: '🏘️',
        place: '📍'
    };
    return icons[type] || '��';
}

// Initialize animations
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.featured-card, .step-card, .festival-card, .state-card, .place-card');
    
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('fade-in-up');
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Set URL parameter
function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Remove URL parameter
function removeUrlParameter(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Load data from localStorage or use default
function loadFromStorage(key, defaultValue = []) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Save data to localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path === '') {
        return 'home';
    } else if (path.includes('map.html')) {
        return 'map';
    } else if (path.includes('state.html')) {
        return 'state';
    } else if (path.includes('contact.html')) {
        return 'contact';
    }
    return 'home';
}

// Load home page data
async function loadHomePageData() {
    try {
        // Check if API is available
        if (typeof api === 'undefined') {
            console.warn('API not available, using fallback data');
            loadFallbackData();
            return;
        }
        
        // Load featured states
        const featuredStates = await api.getFeaturedStates(6);
        displayFeaturedStates(featuredStates);
        
        // Load popular places
        const popularPlaces = await api.getPopularPlaces(8);
        displayPopularPlaces(popularPlaces);
        
    } catch (error) {
        console.error('Error loading home page data:', error);
        loadFallbackData();
    }
}

// Load fallback data when API is not available
function loadFallbackData() {
    const fallbackStates = [
        { id: 1, name: 'Andhra Pradesh', image: 'images/states/andhra_pradesh.jpg', best_time: 'October to March' },
        { id: 11, name: 'Karnataka', image: 'images/states/karnataka.jpg', best_time: 'October to March' },
        { id: 12, name: 'Kerala', image: 'images/states/kerala.jpg', best_time: 'October to March' },
        { id: 21, name: 'Rajasthan', image: 'images/states/rajasthan.jpg', best_time: 'October to March' },
        { id: 26, name: 'Uttar Pradesh', image: 'images/states/uttar_pradesh.jpg', best_time: 'October to March' },
        { id: 28, name: 'West Bengal', image: 'images/states/west_bengal.jpg', best_time: 'October to March' }
    ];
    
    const fallbackPlaces = [
        { id: 1, name: 'Taj Mahal', district_name: 'Agra', state_name: 'Uttar Pradesh', image: 'images/places/taj_mahal.jpg', rating: 4.8, description: 'Iconic white marble mausoleum' },
        { id: 2, name: 'Golden Temple', district_name: 'Amritsar', state_name: 'Punjab', image: 'images/places/golden_temple.jpg', rating: 4.7, description: 'Sacred Sikh shrine' },
        { id: 3, name: 'Gateway of India', district_name: 'Mumbai', state_name: 'Maharashtra', image: 'images/places/gateway_of_india.jpg', rating: 4.5, description: 'Historic monument' },
        { id: 4, name: 'Mysore Palace', district_name: 'Mysore', state_name: 'Karnataka', image: 'images/places/mysore_palace.jpg', rating: 4.6, description: 'Magnificent royal palace' }
    ];
    
    displayFeaturedStates(fallbackStates);
    displayPopularPlaces(fallbackPlaces);
}

// Display featured states
function displayFeaturedStates(states) {
    const container = document.querySelector('.featured-states');
    if (!container) return;
    
    let html = '';
    states.forEach(state => {
        html += `
            <div class="state-card" data-state-id="${state.id}">
                <div class="state-image">
                    <img src="${state.image || 'images/placeholder.jpg'}" alt="${state.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="state-content">
                    <h3>${state.name}</h3>
                    <p>${state.best_time || 'Year-round destination'}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    const stateCards = container.querySelectorAll('.state-card');
    stateCards.forEach(card => {
        card.addEventListener('click', function() {
            const stateId = this.dataset.stateId;
            window.location.href = `state.html?state=${stateId}`;
        });
    });
}

// Display popular places
function displayPopularPlaces(places) {
    const container = document.querySelector('.popular-places');
    if (!container) return;
    
    let html = '';
    places.forEach(place => {
        html += `
            <div class="place-card" data-place-id="${place.id}">
                <div class="place-image">
                    <img src="${place.image || 'images/placeholder.jpg'}" alt="${place.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="place-rating">⭐ ${place.rating || '4.0'}</div>
                </div>
                <div class="place-content">
                    <h4>${place.name}</h4>
                    <p>${place.district_name}, ${place.state_name}</p>
                    <p class="place-description">${place.description || ''}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    const placeCards = container.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        card.addEventListener('click', function() {
            const placeId = this.dataset.placeId;
            // Show place details or navigate to district page
        });
    });
}

// Load map page data
async function loadMapData() {
    try {
        if (typeof api === 'undefined') {
            console.warn('API not available for map data');
            return;
        }
        
        const states = await api.getStates('', 50, 0);
        if (states.success) {
            initializeMap(states.data);
        }
    } catch (error) {
        console.error('Error loading map data:', error);
    }
}

// Load state page data
async function loadStatePageData() {
    const urlParams = new URLSearchParams(window.location.search);
    const stateId = urlParams.get('state');
    const districtId = urlParams.get('district');
    
    if (stateId) {
        await loadStateDetails(stateId);
    } else if (districtId) {
        await loadDistrictDetails(districtId);
    }
}

// Load state details
async function loadStateDetails(stateId) {
    try {
        if (typeof api === 'undefined') {
            console.warn('API not available for state details');
            return;
        }
        
        const [stateResponse, districtsResponse] = await Promise.all([
            api.getStates('', 1, 0), // Get specific state
            api.getDistricts(stateId, '', 50, 0)
        ]);
        
        if (stateResponse.success && districtsResponse.success) {
            const state = stateResponse.data.find(s => s.id == stateId);
            if (state) {
                displayStateDetails(state, districtsResponse.data);
            }
        }
    } catch (error) {
        console.error('Error loading state details:', error);
    }
}

// Load district details
async function loadDistrictDetails(districtId) {
    try {
        if (typeof api === 'undefined') {
            console.warn('API not available for district details');
            return;
        }
        
        const places = await api.getPlaces(districtId, '', '', 0, 50, 0);
        if (places.success) {
            displayDistrictPlaces(places.data);
        }
    } catch (error) {
        console.error('Error loading district details:', error);
    }
}

// Display state details
function displayStateDetails(state, districts) {
    // Update page title and hero
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = state.name;
    }
    
    // Display districts
    const districtsContainer = document.querySelector('.districts-grid');
    if (districtsContainer) {
        let html = '';
        districts.forEach(district => {
            html += `
                <div class="district-card" data-district-id="${district.id}">
                    <div class="district-image">
                        <img src="${district.image || 'images/placeholder.jpg'}" alt="${district.name}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="district-content">
                        <h3>${district.name}</h3>
                        <p>${district.best_time || 'Year-round destination'}</p>
                    </div>
                </div>
            `;
        });
        
        districtsContainer.innerHTML = html;
        
        // Add click handlers
        const districtCards = districtsContainer.querySelectorAll('.district-card');
        districtCards.forEach(card => {
            card.addEventListener('click', function() {
                const districtId = this.dataset.districtId;
                loadDistrictPlaces(districtId);
            });
        });
    }
}

// Display district places
function displayDistrictPlaces(places) {
    const placesContainer = document.querySelector('.places-grid');
    if (!placesContainer) return;
    
    let html = '';
    places.forEach(place => {
        html += `
            <div class="place-card" data-place-id="${place.id}">
                <div class="place-image">
                    <img src="${place.image || 'images/placeholder.jpg'}" alt="${place.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="place-rating">⭐ ${place.rating || '4.0'}</div>
                </div>
                <div class="place-content">
                    <h4>${place.name}</h4>
                    <p class="place-category">${place.category || 'Attraction'}</p>
                    <p class="place-description">${place.description || ''}</p>
                    <div class="place-meta">
                        <span class="entry-fee">₹${place.entry_fee || '0'}</span>
                        <span class="best-time">${place.best_time || 'Year-round'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    placesContainer.innerHTML = html;
    
    // Add click handlers for place details
    const placeCards = placesContainer.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        card.addEventListener('click', function() {
            const placeId = this.dataset.placeId;
            showPlaceDetails(placeId);
        });
    });
}

// Show place details modal
function showPlaceDetails(placeId) {
    // Implementation for showing place details in a modal
    console.log('Show place details for ID:', placeId);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatRating(rating) {
    return rating ? rating.toFixed(1) : 'N/A';
}

// Export functions for use in other modules
window.ProjectInscape = {
    getUrlParameter,
    setUrlParameter,
    removeUrlParameter,
    showNotification,
    loadFromStorage,
    saveToStorage,
    formatNumber,
    capitalizeFirst,
    generateId,
    isInViewport,
    debounce,
    throttle,
    getCurrentPage,
    loadStateDetails,
    loadDistrictDetails,
    formatCurrency,
    formatRating
}; 