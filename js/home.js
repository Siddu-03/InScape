// ===== HOME PAGE JAVASCRIPT =====

// Sample data for search functionality
const statesData = [
    { name: 'Maharashtra', capital: 'Mumbai', region: 'West' },
    { name: 'Karnataka', capital: 'Bangalore', region: 'South' },
    { name: 'Tamil Nadu', capital: 'Chennai', region: 'South' },
    { name: 'Kerala', capital: 'Thiruvananthapuram', region: 'South' },
    { name: 'Rajasthan', capital: 'Jaipur', region: 'North' },
    { name: 'Uttar Pradesh', capital: 'Lucknow', region: 'North' },
    { name: 'West Bengal', capital: 'Kolkata', region: 'East' },
    { name: 'Gujarat', capital: 'Gandhinagar', region: 'West' },
    { name: 'Andhra Pradesh', capital: 'Amaravati', region: 'South' },
    { name: 'Telangana', capital: 'Hyderabad', region: 'South' },
    { name: 'Madhya Pradesh', capital: 'Bhopal', region: 'Central' },
    { name: 'Bihar', capital: 'Patna', region: 'East' },
    { name: 'Odisha', capital: 'Bhubaneswar', region: 'East' },
    { name: 'Assam', capital: 'Dispur', region: 'Northeast' },
    { name: 'Punjab', capital: 'Chandigarh', region: 'North' },
    { name: 'Haryana', capital: 'Chandigarh', region: 'North' },
    { name: 'Himachal Pradesh', capital: 'Shimla', region: 'North' },
    { name: 'Uttarakhand', capital: 'Dehradun', region: 'North' },
    { name: 'Jharkhand', capital: 'Ranchi', region: 'East' },
    { name: 'Chhattisgarh', capital: 'Raipur', region: 'Central' },
    { name: 'Goa', capital: 'Panaji', region: 'West' },
    { name: 'Manipur', capital: 'Imphal', region: 'Northeast' },
    { name: 'Meghalaya', capital: 'Shillong', region: 'Northeast' },
    { name: 'Nagaland', capital: 'Kohima', region: 'Northeast' },
    { name: 'Tripura', capital: 'Agartala', region: 'Northeast' },
    { name: 'Arunachal Pradesh', capital: 'Itanagar', region: 'Northeast' },
    { name: 'Mizoram', capital: 'Aizawl', region: 'Northeast' },
    { name: 'Sikkim', capital: 'Gangtok', region: 'Northeast' }
];

const districtsData = [
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Mysore', state: 'Karnataka' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Thiruvananthapuram', state: 'Kerala' },
    { name: 'Kochi', state: 'Kerala' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Jaisalmer', state: 'Rajasthan' },
    { name: 'Varanasi', state: 'Uttar Pradesh' },
    { name: 'Agra', state: 'Uttar Pradesh' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Darjeeling', state: 'West Bengal' },
    { name: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Surat', state: 'Gujarat' },
    { name: 'Vishakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Vijayawada', state: 'Andhra Pradesh' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Warangal', state: 'Telangana' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Indore', state: 'Madhya Pradesh' },
    { name: 'Patna', state: 'Bihar' },
    { name: 'Gaya', state: 'Bihar' },
    { name: 'Bhubaneswar', state: 'Odisha' },
    { name: 'Puri', state: 'Odisha' },
    { name: 'Guwahati', state: 'Assam' },
    { name: 'Jorhat', state: 'Assam' },
    { name: 'Chandigarh', state: 'Punjab' },
    { name: 'Amritsar', state: 'Punjab' },
    { name: 'Gurgaon', state: 'Haryana' },
    { name: 'Faridabad', state: 'Haryana' },
    { name: 'Shimla', state: 'Himachal Pradesh' },
    { name: 'Manali', state: 'Himachal Pradesh' },
    { name: 'Dehradun', state: 'Uttarakhand' },
    { name: 'Rishikesh', state: 'Uttarakhand' },
    { name: 'Ranchi', state: 'Jharkhand' },
    { name: 'Jamshedpur', state: 'Jharkhand' },
    { name: 'Raipur', state: 'Chhattisgarh' },
    { name: 'Bilaspur', state: 'Chhattisgarh' },
    { name: 'Panaji', state: 'Goa' },
    { name: 'Margao', state: 'Goa' },
    { name: 'Imphal', state: 'Manipur' },
    { name: 'Shillong', state: 'Meghalaya' },
    { name: 'Kohima', state: 'Nagaland' },
    { name: 'Agartala', state: 'Tripura' },
    { name: 'Itanagar', state: 'Arunachal Pradesh' },
    { name: 'Aizawl', state: 'Mizoram' },
    { name: 'Gangtok', state: 'Sikkim' }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFeaturedDestinations();
    initializeFestivalCarousel();
    initializeScrollAnimations();
    initializeHeroEffects();
});

// Initialize featured destinations
function initializeFeaturedDestinations() {
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach(card => {
        card.addEventListener('click', function() {
            const district = this.getAttribute('data-district');
            if (district) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Navigate to the destination
                const link = this.querySelector('.card-btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize festival carousel
function initializeFestivalCarousel() {
    const carousel = document.querySelector('.festivals-carousel');
    if (!carousel) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', function(e) {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', function() {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mouseup', function() {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Auto-scroll carousel
    let autoScrollInterval = setInterval(() => {
        if (!isDown) {
            carousel.scrollLeft += 1;
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0;
            }
        }
    }, 30);
    
    // Pause auto-scroll on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            if (!isDown) {
                carousel.scrollLeft += 1;
                if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                    carousel.scrollLeft = 0;
                }
            }
        }, 30);
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('featured-card')) {
                    const cards = entry.target.parentElement.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.featured-card, .step-card, .festival-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize hero effects
function initializeHeroEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 500);
    }
    
    // Floating animation for search container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        let floatDirection = 1;
        let floatOffset = 0;
        
        setInterval(() => {
            floatOffset += 0.02 * floatDirection;
            if (floatOffset > 1) {
                floatDirection = -1;
            } else if (floatOffset < -1) {
                floatDirection = 1;
            }
            
            searchContainer.style.transform = `translateY(${floatOffset * 5}px)`;
        }, 50);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in-up.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .featured-card {
        transition: all 0.3s ease;
    }
    
    .step-card {
        transition: all 0.3s ease;
    }
    
    .festival-card {
        transition: all 0.3s ease;
    }
    
    .hero-title {
        overflow: hidden;
        white-space: nowrap;
    }
    
    .search-container {
        transition: transform 0.3s ease;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .floating {
        animation: float 3s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Add floating animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const floatingElements = document.querySelectorAll('.step-icon, .trivia-icon');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });
});

// Initialize search functionality for home page
function initializeHomeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    // Only initialize if not already done and we're on the home page
    if (searchInput && !searchInput.dataset.initialized && window.location.pathname.includes('index.html')) {
        console.log('Initializing home search function'); // Debug log
        
        // Mark as initialized to prevent double initialization
        searchInput.dataset.initialized = 'true';
        
        // Handle search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const query = searchInput.value.trim();
                console.log('Home search button clicked:', query); // Debug log
                if (query) {
                    performSearch(query);
                }
            });
        }
        
        // Handle Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                console.log('Home search Enter key pressed:', query); // Debug log
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
}

// Display search suggestions
function displaySuggestions(suggestions, container) {
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
        container.innerHTML = '<div class="suggestion-item">No results found</div>';
        container.style.display = 'block';
        return;
    }
    
    suggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = item.state ? `${item.name}, ${item.state}` : item.name;
        div.addEventListener('click', () => {
            performSearch(item.name, item.state);
        });
        container.appendChild(div);
    });
    
    container.style.display = 'block';
}

// Perform search
function performSearch(query, state = null) {
    // Hide suggestions
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Navigate to appropriate page
    if (state) {
        window.location.href = `state.html?state=${state.toLowerCase().replace(/\s+/g, '-')}&district=${query.toLowerCase().replace(/\s+/g, '-')}`;
    } else {
        const stateMatch = statesData.find(s => s.name.toLowerCase() === query.toLowerCase());
        if (stateMatch) {
            window.location.href = `state.html?state=${stateMatch.name.toLowerCase().replace(/\s+/g, '-')}`;
        } else {
            window.location.href = `state.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// Initialize home search
initializeHomeSearch(); 