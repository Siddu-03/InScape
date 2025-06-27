// ===== MAP PAGE JAVASCRIPT =====

// Global variables
let currentZoom = 1;
let selectedStateId = null;
let statesData = [];

// Global variables for search pagination
let currentSearchQuery = '';
let currentSearchOffset = 0;
let currentSearchResults = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize map functionality if we're on the map page
    if (window.location.pathname.includes('map.html') || document.querySelector('.map-search-container')) {
        initializeMap();
        initializeMapControls();
        initializeDistrictPanel();
        initializeMapSearch();
    }
});

// Initialize interactive map
async function initializeMap() {
    try {
        // Load states data from API
        if (typeof api !== 'undefined') {
            const response = await api.getStates('', 50, 0);
            if (response.success) {
                statesData = response.data;
                createInteractiveMap();
            } else {
                loadFallbackMap();
            }
        } else {
            loadFallbackMap();
        }
    } catch (error) {
        console.error('Error loading map data:', error);
        loadFallbackMap();
    }
}

// Create interactive map with proper India outline
function createInteractiveMap() {
    const mapContainer = document.getElementById('indiaMap');
    if (!mapContainer) return;
    
    // Create SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1000 800');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('class', 'india-svg-map');
    
    // Add India outline
    const indiaOutline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    indiaOutline.setAttribute('d', 'M 100 200 L 150 180 L 200 200 L 250 220 L 300 240 L 350 260 L 400 280 L 450 300 L 500 320 L 550 340 L 600 360 L 650 380 L 700 400 L 750 420 L 800 440 L 850 460 L 900 480 L 950 500 L 1000 520 L 950 540 L 900 560 L 850 580 L 800 600 L 750 620 L 700 640 L 650 660 L 600 680 L 550 700 L 500 720 L 450 740 L 400 760 L 350 780 L 300 800 L 250 780 L 200 760 L 150 740 L 100 720 L 50 700 L 0 680 L 50 660 L 100 640 L 150 620 L 200 600 L 250 580 L 300 560 L 350 540 L 400 520 L 450 500 L 500 480 L 550 460 L 600 440 L 650 420 L 700 400 L 750 380 L 800 360 L 850 340 L 900 320 L 950 300 L 1000 280 L 950 260 L 900 240 L 850 220 L 800 200 L 750 180 L 700 160 L 650 140 L 600 120 L 550 100 L 500 80 L 450 60 L 400 40 L 350 20 L 300 0 L 250 20 L 200 40 L 150 60 L 100 80 L 50 100 L 0 120 L 50 140 L 100 160 L 150 180 Z');
    indiaOutline.setAttribute('fill', '#f0f0f0');
    indiaOutline.setAttribute('stroke', '#ccc');
    indiaOutline.setAttribute('stroke-width', '2');
    svg.appendChild(indiaOutline);
    
    // Create state regions (simplified but more accurate than before)
    const stateRegions = [
        // North India
        { id: 1, name: 'Jammu and Kashmir', path: 'M 200 50 L 250 40 L 300 60 L 250 80 L 200 60 Z', region: 'North' },
        { id: 2, name: 'Himachal Pradesh', path: 'M 250 80 L 300 60 L 350 80 L 300 100 L 250 80 Z', region: 'North' },
        { id: 3, name: 'Punjab', path: 'M 300 100 L 350 80 L 400 100 L 350 120 L 300 100 Z', region: 'North' },
        { id: 4, name: 'Haryana', path: 'M 350 120 L 400 100 L 450 120 L 400 140 L 350 120 Z', region: 'North' },
        { id: 5, name: 'Uttarakhand', path: 'M 400 140 L 450 120 L 500 140 L 450 160 L 400 140 Z', region: 'North' },
        { id: 6, name: 'Uttar Pradesh', path: 'M 450 160 L 500 140 L 550 160 L 500 180 L 450 160 Z', region: 'North' },
        { id: 7, name: 'Rajasthan', path: 'M 200 120 L 250 100 L 300 120 L 250 140 L 200 120 Z', region: 'North' },
        
        // Central India
        { id: 8, name: 'Madhya Pradesh', path: 'M 300 180 L 350 160 L 400 180 L 350 200 L 300 180 Z', region: 'Central' },
        { id: 9, name: 'Chhattisgarh', path: 'M 400 200 L 450 180 L 500 200 L 450 220 L 400 200 Z', region: 'Central' },
        { id: 10, name: 'Jharkhand', path: 'M 500 220 L 550 200 L 600 220 L 550 240 L 500 220 Z', region: 'Central' },
        
        // East India
        { id: 11, name: 'Bihar', path: 'M 550 240 L 600 220 L 650 240 L 600 260 L 550 240 Z', region: 'East' },
        { id: 12, name: 'West Bengal', path: 'M 600 260 L 650 240 L 700 260 L 650 280 L 600 260 Z', region: 'East' },
        { id: 13, name: 'Odisha', path: 'M 650 280 L 700 260 L 750 280 L 700 300 L 650 280 Z', region: 'East' },
        { id: 14, name: 'Assam', path: 'M 700 300 L 750 280 L 800 300 L 750 320 L 700 300 Z', region: 'East' },
        
        // Northeast India
        { id: 15, name: 'Arunachal Pradesh', path: 'M 800 320 L 850 300 L 900 320 L 850 340 L 800 320 Z', region: 'Northeast' },
        { id: 16, name: 'Nagaland', path: 'M 850 340 L 900 320 L 950 340 L 900 360 L 850 340 Z', region: 'Northeast' },
        { id: 17, name: 'Manipur', path: 'M 900 360 L 950 340 L 1000 360 L 950 380 L 900 360 Z', region: 'Northeast' },
        { id: 18, name: 'Mizoram', path: 'M 950 380 L 1000 360 L 1000 400 L 950 420 L 950 380 Z', region: 'Northeast' },
        { id: 19, name: 'Tripura', path: 'M 900 400 L 950 380 L 1000 400 L 950 420 L 900 400 Z', region: 'Northeast' },
        { id: 20, name: 'Meghalaya', path: 'M 850 420 L 900 400 L 950 420 L 900 440 L 850 420 Z', region: 'Northeast' },
        { id: 21, name: 'Sikkim', path: 'M 800 440 L 850 420 L 900 440 L 850 460 L 800 440 Z', region: 'Northeast' },
        
        // West India
        { id: 22, name: 'Gujarat', path: 'M 150 200 L 200 180 L 250 200 L 200 220 L 150 200 Z', region: 'West' },
        { id: 23, name: 'Maharashtra', path: 'M 250 220 L 300 200 L 350 220 L 300 240 L 250 220 Z', region: 'West' },
        { id: 24, name: 'Goa', path: 'M 300 240 L 350 220 L 400 240 L 350 260 L 300 240 Z', region: 'West' },
        
        // South India
        { id: 25, name: 'Karnataka', path: 'M 350 260 L 400 240 L 450 260 L 400 280 L 350 260 Z', region: 'South' },
        { id: 26, name: 'Kerala', path: 'M 400 280 L 450 260 L 500 280 L 450 300 L 400 280 Z', region: 'South' },
        { id: 27, name: 'Tamil Nadu', path: 'M 450 300 L 500 280 L 550 300 L 500 320 L 450 300 Z', region: 'South' },
        { id: 28, name: 'Andhra Pradesh', path: 'M 500 320 L 550 300 L 600 320 L 550 340 L 500 320 Z', region: 'South' },
        { id: 29, name: 'Telangana', path: 'M 550 340 L 600 320 L 650 340 L 600 360 L 550 340 Z', region: 'South' }
    ];
    
    // Create state paths
    stateRegions.forEach(state => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `state-${state.id}`);
        path.setAttribute('d', state.path);
        path.setAttribute('class', 'state-path');
        path.setAttribute('data-state-id', state.id);
        path.setAttribute('data-state-name', state.name);
        path.setAttribute('data-region', state.region);
        path.setAttribute('title', state.name);
        
        // Set initial styles
        path.setAttribute('fill', '#e8f4fd');
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('cursor', 'pointer');
        
        // Add hover effects
        path.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.setAttribute('fill', '#FFB347');
                this.setAttribute('stroke', '#000080');
                this.setAttribute('stroke-width', '3');
            }
        });
        
        path.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.setAttribute('fill', '#e8f4fd');
                this.setAttribute('stroke', '#ffffff');
                this.setAttribute('stroke-width', '2');
            }
        });
        
        // Add click handler
        path.addEventListener('click', function() {
            const stateId = this.getAttribute('data-state-id');
            const stateName = this.getAttribute('data-state-name');
            selectState(stateId, stateName);
        });
        
        svg.appendChild(path);
    });
    
    // Add state labels
    stateRegions.forEach(state => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const pathElement = svg.querySelector(`#state-${state.id}`);
        if (pathElement) {
            const bbox = pathElement.getBBox();
            text.setAttribute('x', bbox.x + bbox.width / 2);
            text.setAttribute('y', bbox.y + bbox.height / 2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('class', 'state-label');
            text.setAttribute('font-size', '10');
            text.setAttribute('fill', '#333');
            text.setAttribute('pointer-events', 'none');
            text.textContent = state.name.split(' ')[0]; // Show first word only
            svg.appendChild(text);
        }
    });
    
    mapContainer.appendChild(svg);
}

// Load fallback map when API is not available
function loadFallbackMap() {
    console.warn('Using fallback map data');
    statesData = [
        { id: 1, name: 'Maharashtra', region: 'West' },
        { id: 2, name: 'Karnataka', region: 'South' },
        { id: 3, name: 'Tamil Nadu', region: 'South' },
        { id: 4, name: 'Kerala', region: 'South' },
        { id: 5, name: 'Rajasthan', region: 'North' },
        { id: 6, name: 'Uttar Pradesh', region: 'North' },
        { id: 7, name: 'West Bengal', region: 'East' },
        { id: 8, name: 'Gujarat', region: 'West' },
        { id: 9, name: 'Andhra Pradesh', region: 'South' },
        { id: 10, name: 'Telangana', region: 'South' }
    ];
    createInteractiveMap();
}

// Select state
function selectState(stateId, stateName) {
    // Remove previous selection
    document.querySelectorAll('.state-path').forEach(path => {
        path.classList.remove('selected');
        path.setAttribute('fill', '#e8f4fd');
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
    });
    
    // Select new state
    const selectedPath = document.querySelector(`#state-${stateId}`);
    if (selectedPath) {
        selectedPath.classList.add('selected');
        selectedPath.setAttribute('fill', '#FFB347');
        selectedPath.setAttribute('stroke', '#000080');
        selectedPath.setAttribute('stroke-width', '4');
    }
    
    selectedStateId = stateId;
    
    // Update district panel
    updateDistrictPanel(stateId, stateName);
    
    // Update URL
    if (window.InscapeMain && window.InscapeMain.setUrlParameter) {
        window.InscapeMain.setUrlParameter('state', stateId);
    }
}

// Initialize map controls
function initializeMapControls() {
    const resetBtn = document.getElementById('resetMap');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetMap);
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', zoomIn);
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', zoomOut);
    }
}

// Reset map
function resetMap() {
    // Remove all selections
    document.querySelectorAll('.state-path').forEach(path => {
        path.classList.remove('selected');
        path.setAttribute('fill', '#e8f4fd');
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
    });
    
    // Reset district panel
    resetDistrictPanel();
    
    // Reset zoom
    currentZoom = 1;
    updateMapZoom();
    
    selectedStateId = null;
    
    // Remove URL parameters
    if (window.InscapeMain && window.InscapeMain.removeUrlParameter) {
        window.InscapeMain.removeUrlParameter('state');
        window.InscapeMain.removeUrlParameter('district');
    }
}

// Zoom in
function zoomIn() {
    if (currentZoom < 3) {
        currentZoom += 0.5;
        updateMapZoom();
    }
}

// Zoom out
function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom -= 0.5;
        updateMapZoom();
    }
}

// Update map zoom
function updateMapZoom() {
    const svg = document.querySelector('.india-svg-map');
    if (svg) {
        svg.style.transform = `scale(${currentZoom})`;
        svg.style.transformOrigin = 'center center';
    }
}

// Initialize district panel
function initializeDistrictPanel() {
    const closeBtn = document.getElementById('closePanel');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const panel = document.getElementById('districtPanel');
            if (panel) {
                panel.classList.remove('active');
            }
        });
    }
}

// Update district panel
async function updateDistrictPanel(stateId, stateName) {
    const panel = document.getElementById('districtPanel');
    const stateTitle = document.getElementById('selectedState');
    const districtList = document.getElementById('districtList');
    
    if (!panel || !stateTitle || !districtList) return;
    
    // Update title
    stateTitle.textContent = stateName || 'Selected State';
    
    // Show loading
    districtList.innerHTML = '<div class="loading">Loading districts...</div>';
    panel.classList.add('active');
    
    try {
        // Load districts from API
        if (typeof api !== 'undefined') {
            const response = await api.getDistricts(stateId, '', 50, 0);
            if (response.success && response.data.length > 0) {
                displayDistricts(response.data);
            } else {
                districtList.innerHTML = '<p class="no-districts">No districts found for this state.</p>';
            }
        } else {
            // Fallback districts
            const fallbackDistricts = getFallbackDistricts(stateName);
            displayDistricts(fallbackDistricts);
        }
    } catch (error) {
        console.error('Error loading districts:', error);
        districtList.innerHTML = '<p class="error">Failed to load districts. Please try again.</p>';
    }
}

// Display districts in panel
function displayDistricts(districts) {
    const districtList = document.getElementById('districtList');
    if (!districtList) return;
    
    let html = '';
    districts.forEach(district => {
        html += `
            <div class="district-item" data-district-id="${district.id}">
                <div class="district-info">
                    <h4>${district.name}</h4>
                    <p>${district.best_time || 'Year-round destination'}</p>
                </div>
                <button class="explore-btn" onclick="exploreDistrict(${district.id})">Explore</button>
            </div>
        `;
    });
    
    districtList.innerHTML = html;
}

// Get fallback districts
function getFallbackDistricts(stateName) {
    const fallbackData = {
        'Maharashtra': [
            { id: 1, name: 'Mumbai', best_time: 'October to March' },
            { id: 2, name: 'Pune', best_time: 'October to March' },
            { id: 3, name: 'Nagpur', best_time: 'October to March' }
        ],
        'Karnataka': [
            { id: 4, name: 'Bangalore', best_time: 'October to March' },
            { id: 5, name: 'Mysore', best_time: 'October to March' },
            { id: 6, name: 'Mangalore', best_time: 'October to March' }
        ],
        'Tamil Nadu': [
            { id: 7, name: 'Chennai', best_time: 'November to March' },
            { id: 8, name: 'Coimbatore', best_time: 'October to March' },
            { id: 9, name: 'Madurai', best_time: 'October to March' }
        ]
    };
    
    return fallbackData[stateName] || [
        { id: 1, name: 'Capital City', best_time: 'Year-round destination' },
        { id: 2, name: 'Major District', best_time: 'Year-round destination' }
    ];
}

// Reset district panel
function resetDistrictPanel() {
    const panel = document.getElementById('districtPanel');
    const stateTitle = document.getElementById('selectedState');
    const districtList = document.getElementById('districtList');
    
    if (panel) panel.classList.remove('active');
    if (stateTitle) stateTitle.textContent = 'Select a State';
    if (districtList) {
        districtList.innerHTML = '<p class="placeholder-text">Click on a state to see its districts</p>';
    }
}

// Explore district
function exploreDistrict(districtId) {
    window.location.href = `state.html?district=${districtId}`;
}

// Initialize map search - SPECIFIC TO MAP PAGE
function initializeMapSearch() {
    const mapSearchContainer = document.querySelector('.map-search-container');
    if (!mapSearchContainer) return;
    
    const searchInput = mapSearchContainer.querySelector('.search-input');
    const searchForm = mapSearchContainer.querySelector('.search-form');
    
    if (searchInput) {
        console.log('Map search initialized'); // Debug log
        
        // Handle form submission only - no input event listener
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                console.log('Map search form submitted:', query); // Debug log
                if (query) {
                    performMapSearch(query);
                }
            });
        }
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.map-search-container')) {
                hideMapSearchResults();
            }
        });
    }
}

// Perform map search
async function performMapSearch(query, offset = 0) {
    console.log('Performing map search for:', query, 'offset:', offset); // Debug log
    
    try {
        const searchResults = document.querySelector('.map-search-container .search-results');
        if (!searchResults) {
            console.error('Search results container not found');
            return;
        }
        
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
            console.log('API not available, showing fallback');
            searchResults.innerHTML = '<div class="search-no-results">Search temporarily unavailable</div>';
            return;
        }
        
        console.log('Calling API search...'); // Debug log
        
        // Call API
        const response = await api.search(query, 'all', 50, offset);
        
        console.log('API response:', response); // Debug log
        
        if (response.success && response.data.length > 0) {
            if (offset === 0) {
                // First search - replace results
                currentSearchResults = response.data;
                displayMapSearchResults(response.data, response.pagination);
            } else {
                // Load more - append results
                currentSearchResults = currentSearchResults.concat(response.data);
                displayMapSearchResults(currentSearchResults, response.pagination);
            }
            currentSearchOffset = offset + response.data.length;
        } else {
            if (offset === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            }
        }
    } catch (error) {
        console.error('Map search error:', error);
        const searchResults = document.querySelector('.map-search-container .search-results');
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        }
    }
}

// Load more search results
function loadMoreSearchResults() {
    if (currentSearchQuery) {
        performMapSearch(currentSearchQuery, currentSearchOffset);
    }
}

// Display map search results
function displayMapSearchResults(results, pagination = null) {
    console.log('Displaying map search results:', results); // Debug log
    
    const searchResults = document.querySelector('.map-search-container .search-results');
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
            handleMapSearchResultClick(type, id);
        });
    });
}

// Handle map search result click
function handleMapSearchResultClick(type, id) {
    console.log('Map search result clicked:', type, id); // Debug log
    
    if (type === 'state') {
        // Highlight state on map
        const statePath = document.querySelector(`#state-${id}`);
        if (statePath) {
            const stateName = statePath.getAttribute('data-state-name');
            selectState(id, stateName);
        }
    } else if (type === 'district') {
        // Navigate to district page
        window.location.href = `state.html?district=${id}`;
    } else if (type === 'place') {
        // Navigate to place details
        window.location.href = `state.html?place=${id}`;
    }
    
    hideMapSearchResults();
}

// Hide map search results
function hideMapSearchResults() {
    const searchResults = document.querySelector('.map-search-container .search-results');
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
    return icons[type] || '📍';
} 