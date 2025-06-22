// ===== STATE PAGE JAVASCRIPT =====

// Sample data for places
const placesData = {
    'varanasi': [
        {
            id: 1,
            name: 'Kashi Vishwanath Temple',
            description: 'One of the most sacred Hindu temples dedicated to Lord Shiva',
            image: 'assets/images/kashi-vishwanath.jpg',
            type: 'religious',
            tags: ['religious', 'heritage'],
            rating: 4.8,
            distance: '0.5 km from city center'
        },
        {
            id: 2,
            name: 'Ganga Ghats',
            description: 'Sacred riverfront steps where pilgrims perform rituals',
            image: 'assets/images/ganga-ghats.jpg',
            type: 'religious',
            tags: ['religious', 'nature'],
            rating: 4.6,
            distance: '1 km from city center'
        },
        {
            id: 3,
            name: 'Sarnath',
            description: 'Buddhist pilgrimage site where Buddha gave his first sermon',
            image: 'assets/images/sarnath.jpg',
            type: 'historical',
            tags: ['historical', 'religious'],
            rating: 4.5,
            distance: '10 km from city center'
        }
    ],
    'mumbai': [
        {
            id: 4,
            name: 'Gateway of India',
            description: 'Historic monument and popular tourist attraction',
            image: 'assets/images/gateway-india.jpg',
            type: 'historical',
            tags: ['historical', 'heritage'],
            rating: 4.3,
            distance: '2 km from city center'
        },
        {
            id: 5,
            name: 'Marine Drive',
            description: 'Scenic coastal road known as the Queen\'s Necklace',
            image: 'assets/images/marine-drive.jpg',
            type: 'nature',
            tags: ['nature', 'beach'],
            rating: 4.7,
            distance: '3 km from city center'
        },
        {
            id: 6,
            name: 'Elephanta Caves',
            description: 'Ancient cave temples dedicated to Lord Shiva',
            image: 'assets/images/elephanta-caves.jpg',
            type: 'historical',
            tags: ['historical', 'religious'],
            rating: 4.4,
            distance: '10 km from city center'
        }
    ],
    'bangalore': [
        {
            id: 7,
            name: 'Lalbagh Botanical Garden',
            description: 'Famous botanical garden with rare plant species',
            image: 'assets/images/lalbagh.jpg',
            type: 'nature',
            tags: ['nature', 'wildlife'],
            rating: 4.5,
            distance: '4 km from city center'
        },
        {
            id: 8,
            name: 'Cubbon Park',
            description: 'Historic park in the heart of the city',
            image: 'assets/images/cubbon-park.jpg',
            type: 'nature',
            tags: ['nature', 'heritage'],
            rating: 4.2,
            distance: '2 km from city center'
        },
        {
            id: 9,
            name: 'Bangalore Palace',
            description: 'Royal palace with Tudor-style architecture',
            image: 'assets/images/bangalore-palace.jpg',
            type: 'heritage',
            tags: ['heritage', 'historical'],
            rating: 4.1,
            distance: '3 km from city center'
        }
    ]
};

// Global variables
let currentPlaces = [];
let filteredPlaces = [];
let currentPage = 1;
const placesPerPage = 6;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeFilters();
    initializePlaceCards();
    loadPlaces();
});

// Initialize page
function initializePage() {
    const stateParam = ProjectInscape.getUrlParameter('state');
    const districtParam = ProjectInscape.getUrlParameter('district');
    const searchParam = ProjectInscape.getUrlParameter('search');
    
    // Update page title and breadcrumb
    updatePageHeader(stateParam, districtParam, searchParam);
    
    // Load places based on parameters
    if (districtParam) {
        loadPlacesForDistrict(districtParam);
    } else if (stateParam) {
        loadPlacesForState(stateParam);
    } else if (searchParam) {
        searchPlaces(searchParam);
    } else {
        loadAllPlaces();
    }
}

// Update page header
function updatePageHeader(state, district, search) {
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const currentLocation = document.getElementById('currentLocation');
    
    if (district) {
        const districtName = district.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const stateName = state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (pageTitle) pageTitle.textContent = `Discover ${districtName}`;
        if (pageSubtitle) pageSubtitle.textContent = `Explore the amazing places in ${districtName}, ${stateName}`;
        if (currentLocation) currentLocation.textContent = `${stateName} > ${districtName}`;
    } else if (state) {
        const stateName = state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (pageTitle) pageTitle.textContent = `Discover ${stateName}`;
        if (pageSubtitle) pageSubtitle.textContent = `Explore the rich culture and heritage of ${stateName}`;
        if (currentLocation) currentLocation.textContent = stateName;
    } else if (search) {
        if (pageTitle) pageTitle.textContent = `Search Results for "${search}"`;
        if (pageSubtitle) pageSubtitle.textContent = 'Discover amazing places across India';
        if (currentLocation) currentLocation.textContent = 'Search Results';
    } else {
        if (pageTitle) pageTitle.textContent = 'Discover Amazing Places';
        if (pageSubtitle) pageSubtitle.textContent = 'Explore the rich culture, history, and beauty of India\'s districts';
        if (currentLocation) currentLocation.textContent = 'Destinations';
    }
}

// Initialize filters
function initializeFilters() {
    const placeTypeFilter = document.getElementById('placeTypeFilter');
    const sortByFilter = document.getElementById('sortBy');
    const searchPlacesInput = document.getElementById('searchPlaces');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (placeTypeFilter) {
        placeTypeFilter.addEventListener('change', applyFilters);
    }
    
    if (sortByFilter) {
        sortByFilter.addEventListener('change', applyFilters);
    }
    
    if (searchPlacesInput) {
        searchPlacesInput.addEventListener('input', ProjectInscape.debounce(applyFilters, 300));
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Apply filters
function applyFilters() {
    const placeTypeFilter = document.getElementById('placeTypeFilter');
    const sortByFilter = document.getElementById('sortBy');
    const searchPlacesInput = document.getElementById('searchPlaces');
    
    let filtered = [...currentPlaces];
    
    // Filter by type
    if (placeTypeFilter && placeTypeFilter.value) {
        filtered = filtered.filter(place => place.type === placeTypeFilter.value);
    }
    
    // Filter by search
    if (searchPlacesInput && searchPlacesInput.value.trim()) {
        const searchTerm = searchPlacesInput.value.toLowerCase();
        filtered = filtered.filter(place => 
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            place.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort results
    if (sortByFilter && sortByFilter.value) {
        switch (sortByFilter.value) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popularity':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'distance':
                filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
        }
    }
    
    filteredPlaces = filtered;
    currentPage = 1;
    displayPlaces();
    updatePlacesCount();
}

// Clear filters
function clearFilters() {
    const placeTypeFilter = document.getElementById('placeTypeFilter');
    const sortByFilter = document.getElementById('sortBy');
    const searchPlacesInput = document.getElementById('searchPlaces');
    
    if (placeTypeFilter) placeTypeFilter.value = '';
    if (sortByFilter) sortByFilter.value = 'name';
    if (searchPlacesInput) searchPlacesInput.value = '';
    
    filteredPlaces = [...currentPlaces];
    currentPage = 1;
    displayPlaces();
    updatePlacesCount();
}

// Load places
function loadPlaces() {
    // Show loading state
    const placesGrid = document.getElementById('placesGrid');
    if (placesGrid) {
        placesGrid.innerHTML = `
            <div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>Loading amazing places...</p>
            </div>
        `;
    }
    
    // Simulate loading delay
    setTimeout(() => {
        loadAllPlaces();
    }, 1000);
}

// Load places for specific district
function loadPlacesForDistrict(district) {
    const districtKey = district.replace(/-/g, '');
    currentPlaces = placesData[districtKey] || [];
    filteredPlaces = [...currentPlaces];
    displayPlaces();
    updatePlacesCount();
}

// Load places for specific state
function loadPlacesForState(state) {
    // For demo purposes, load places from multiple districts
    currentPlaces = [];
    Object.values(placesData).forEach(districtPlaces => {
        currentPlaces.push(...districtPlaces);
    });
    filteredPlaces = [...currentPlaces];
    displayPlaces();
    updatePlacesCount();
}

// Load all places
function loadAllPlaces() {
    currentPlaces = [];
    Object.values(placesData).forEach(districtPlaces => {
        currentPlaces.push(...districtPlaces);
    });
    filteredPlaces = [...currentPlaces];
    displayPlaces();
    updatePlacesCount();
}

// Search places
function searchPlaces(query) {
    currentPlaces = [];
    Object.values(placesData).forEach(districtPlaces => {
        currentPlaces.push(...districtPlaces);
    });
    
    const searchTerm = query.toLowerCase();
    filteredPlaces = currentPlaces.filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    displayPlaces();
    updatePlacesCount();
}

// Display places
function displayPlaces() {
    const placesGrid = document.getElementById('placesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!placesGrid) return;
    
    const startIndex = (currentPage - 1) * placesPerPage;
    const endIndex = startIndex + placesPerPage;
    const placesToShow = filteredPlaces.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
        placesGrid.innerHTML = '';
    }
    
    if (placesToShow.length === 0) {
        if (currentPage === 1) {
            placesGrid.innerHTML = `
                <div class="no-results">
                    <h3>No places found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
        }
        return;
    }
    
    placesToShow.forEach(place => {
        const placeCard = createPlaceCard(place);
        placesGrid.appendChild(placeCard);
    });
    
    // Show/hide load more button
    if (loadMoreBtn) {
        if (endIndex < filteredPlaces.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Create place card
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.setAttribute('data-district', place.district || '');
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${place.image}" alt="${place.name}" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="card-overlay">
                <span class="card-tag">${place.type}</span>
            </div>
        </div>
        <div class="card-content">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <div class="place-tags">
                ${place.tags.map(tag => `<span class="place-tag ${tag}">${tag}</span>`).join('')}
            </div>
            <div class="place-info">
                <span class="rating">⭐ ${place.rating}</span>
                <span class="distance">📍 ${place.distance}</span>
            </div>
            <div class="place-actions">
                <a href="#" class="place-btn primary">More Info</a>
                <a href="#" class="place-btn secondary">Get Directions</a>
            </div>
        </div>
    `;
    
    // Add click handler
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('place-btn')) {
            showPlaceDetails(place);
        }
    });
    
    return card;
}

// Show place details
function showPlaceDetails(place) {
    // Create modal for place details
    const modal = document.createElement('div');
    modal.className = 'place-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${place.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${place.image}" alt="${place.name}" onerror="this.src='assets/images/placeholder.jpg'">
                    <p>${place.description}</p>
                    <div class="place-details">
                        <div class="detail-item">
                            <strong>Type:</strong> ${place.type}
                        </div>
                        <div class="detail-item">
                            <strong>Rating:</strong> ⭐ ${place.rating}
                        </div>
                        <div class="detail-item">
                            <strong>Distance:</strong> 📍 ${place.distance}
                        </div>
                        <div class="detail-item">
                            <strong>Tags:</strong> ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn">Get Directions</button>
                    <button class="btn btn-secondary">Add to Favorites</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .place-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-body img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .place-details {
            margin-top: 15px;
        }
        .detail-item {
            margin-bottom: 10px;
        }
        .tag {
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 4px;
            margin-right: 5px;
            font-size: 0.8rem;
        }
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(modal);
        }
    });
}

// Update places count
function updatePlacesCount() {
    const placesCount = document.getElementById('placesCount');
    if (placesCount) {
        placesCount.textContent = filteredPlaces.length;
    }
}

// Initialize place cards
function initializePlaceCards() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            displayPlaces();
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .place-card {
        animation: fadeInUp 0.6s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .no-results {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .place-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: #666;
    }
    
    .rating {
        color: #f39c12;
    }
    
    .distance {
        color: #3498db;
    }
`;
document.head.appendChild(style); 