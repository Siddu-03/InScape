// ===== CONTACT PAGE JAVASCRIPT =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeRatingSystem();
    initializeFormValidation();
    initializeSocialLinks();
});

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        rating: formData.get('rating'),
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Save to localStorage (in real app, this would be sent to server)
        saveContactSubmission(data);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
        resetRating();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear any error messages
        clearAllErrors();
        
    }, 2000);
}

// Validate form
function validateForm() {
    const form = document.getElementById('contactForm');
    const fields = ['name', 'email', 'message'];
    let isValid = true;
    
    fields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    // Clear previous error
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }
            break;
    }
    
    // Show error if validation failed
    if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        field.style.borderColor = '#F44336';
    } else {
        field.style.borderColor = '';
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    field.style.borderColor = '';
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
    
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize rating system
function initializeRatingSystem() {
    const stars = document.querySelectorAll('.stars input');
    const ratingText = document.querySelector('.rating-text');
    
    stars.forEach((star, index) => {
        star.addEventListener('change', function() {
            const rating = this.value;
            updateRatingDisplay(rating, ratingText);
        });
        
        // Hover effects
        star.addEventListener('mouseenter', function() {
            const rating = this.value;
            updateRatingDisplay(rating, ratingText, true);
        });
    });
    
    // Reset rating display when mouse leaves stars container
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            const checkedStar = document.querySelector('.stars input:checked');
            const rating = checkedStar ? checkedStar.value : 0;
            updateRatingDisplay(rating, ratingText);
        });
    }
}

// Update rating display
function updateRatingDisplay(rating, ratingText, isHover = false) {
    if (!ratingText) return;
    
    const ratingMessages = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    if (rating > 0) {
        ratingText.textContent = ratingMessages[rating];
        ratingText.style.color = isHover ? '#FFD700' : '#333';
    } else {
        ratingText.textContent = 'Click to rate';
        ratingText.style.color = '#666';
    }
}

// Reset rating
function resetRating() {
    const stars = document.querySelectorAll('.stars input');
    const ratingText = document.querySelector('.rating-text');
    
    stars.forEach(star => {
        star.checked = false;
    });
    
    updateRatingDisplay(0, ratingText);
}

// Initialize form validation
function initializeFormValidation() {
    // Add custom validation styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #F44336 !important;
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
        }
        
        .form-group input.valid,
        .form-group textarea.valid,
        .form-group select.valid {
            border-color: #4CAF50 !important;
        }
        
        .error-message {
            color: #F44336;
            font-size: 0.8rem;
            margin-top: 5px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .success-message {
            background: #E8F5E8;
            color: #2E7D32;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #4CAF50;
            display: none;
        }
        
        .success-message.show {
            display: block;
        }
    `;
    document.head.appendChild(style);
}

// Initialize social links
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get platform from link text or href
            const platform = this.textContent.toLowerCase().trim();
            
            // Show notification
            ProjectInscape.showNotification(
                `Redirecting to ${platform}...`, 
                'info'
            );
            
            // In a real app, this would open the actual social media profile
            setTimeout(() => {
                window.open(this.href || '#', '_blank');
            }, 1000);
        });
    });
}

// Save contact submission
function saveContactSubmission(data) {
    try {
        // Get existing submissions
        const submissions = ProjectInscape.loadFromStorage('contactSubmissions', []);
        
        // Add new submission
        submissions.push({
            ...data,
            id: ProjectInscape.generateId()
        });
        
        // Save back to localStorage
        ProjectInscape.saveToStorage('contactSubmissions', submissions);
        
        // Also save to recent submissions (last 5)
        const recentSubmissions = submissions.slice(-5);
        ProjectInscape.saveToStorage('recentContactSubmissions', recentSubmissions);
        
    } catch (error) {
        console.error('Error saving contact submission:', error);
    }
}

// Show success message
function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h4>✅ Message Sent Successfully!</h4>
        <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
    `;
    
    // Insert at the top of the form
    const form = document.getElementById('contactForm');
    if (form) {
        form.insertBefore(successMessage, form.firstChild);
        
        // Show the message
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 300);
        }, 5000);
    }
}

// Character counter for message field
function initializeCharacterCounter() {
    const messageField = document.querySelector('textarea[name="message"]');
    if (!messageField) return;
    
    // Create character counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: 0.8rem;
        color: #666;
        text-align: right;
        margin-top: 5px;
    `;
    
    messageField.parentNode.appendChild(counter);
    
    // Update counter on input
    messageField.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 1000; // Set maximum character limit
        
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#F44336';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#FF9800';
        } else {
            counter.style.color = '#666';
        }
        
        // Truncate if over limit
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
        }
    });
    
    // Initialize counter
    messageField.dispatchEvent(new Event('input'));
}

// Initialize character counter
initializeCharacterCounter();

// Add form enhancement features
function enhanceForm() {
    // Auto-resize textarea
    const textarea = document.querySelector('textarea[name="message"]');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    }
    
    // Add focus effects
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
}

// Initialize form enhancements
enhanceForm();

// Add CSS for enhanced form styling
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    .form-group.focused label {
        color: #FF9933;
    }
    
    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
        border-color: #FF9933;
        box-shadow: 0 0 0 3px rgba(255, 153, 51, 0.1);
    }
    
    textarea {
        transition: height 0.3s ease;
    }
    
    .social-link {
        transition: all 0.3s ease;
    }
    
    .social-link:hover {
        transform: translateX(5px) scale(1.05);
    }
    
    .info-card {
        transition: all 0.3s ease;
    }
    
    .info-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .faq-item {
        transition: all 0.3s ease;
    }
    
    .faq-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(enhancedStyle); 