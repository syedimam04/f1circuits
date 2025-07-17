// F1Circuits.in - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeScrollEffects();
    initializeLoadingScreen();
    initializeParallaxEffects();
    initializeProductCardInteractions();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 70;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Loading screen animation
function initializeLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Hide loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                // Trigger entrance animations
                triggerEntranceAnimations();
            }, 500);
        }, 1500); // Show loading for 1.5 seconds
    });
}

// Entrance animations
function triggerEntranceAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.animation = 'slideInLeft 1s ease-out';
    }
    if (heroDescription) {
        setTimeout(() => {
            heroDescription.style.animation = 'slideInLeft 1s ease-out 0.3s both';
        }, 300);
    }
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.style.animation = 'slideInLeft 1s ease-out 0.6s both';
        }, 600);
    }
}

// Scroll-based animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for product cards
                if (entry.target.classList.contains('product-card')) {
                    const cards = document.querySelectorAll('.product-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .feature-item, .contact-item, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Product card interactions
function initializeProductCardInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover sound effect (visual feedback)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Click analytics (you can integrate with your analytics service)
        card.addEventListener('click', function() {
            const productType = this.getAttribute('data-product');
            trackProductInteraction(productType);
        });
    });
}

// Track product interactions
function trackProductInteraction(productType) {
    // Analytics tracking
    console.log(`Product interaction: ${productType}`);
    
    // You can integrate with Google Analytics or other tracking services here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'product_view', {
            'product_type': productType,
            'page_title': 'F1Circuits.in'
        });
    }
}

// Form handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Real-time form validation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form submission handler
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();

    // Validate form
    if (!validateForm(name, email, message)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Create WhatsApp message
    const whatsappMessage = `Hello! New inquiry from F1Circuits.in website:
    
Name: ${name}
Email: ${email}
Message: ${message}
    
Please respond to this inquiry. Thank you!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/918121612298?text=${encodedMessage}`;

    // Simulate form processing
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage('Message sent successfully! Redirecting to WhatsApp...');
        
        // Redirect to WhatsApp
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
    }, 1500);
}

// Form validation
function validateForm(name, email, message) {
    let isValid = true;

    if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }

    if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }

    return isValid;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.parentElement;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.style.borderColor = '#dc143c';
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc143c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.style.borderColor = 'transparent';
}

// Show success message
function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #25d366, #128c7e);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Scroll effects
function initializeScrollEffects() {
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Navbar active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Parallax effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero::before, .racing-track');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('racing-track')) {
                element.style.transform = `translateY(${parallax}px)`;
            }
        });
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Enter or Space on WhatsApp buttons
    if ((e.key === 'Enter' || e.key === ' ') && 
        (e.target.classList.contains('whatsapp-btn') || 
         e.target.classList.contains('main-whatsapp-btn'))) {
        e.preventDefault();
        e.target.click();
    }
});

// Performance optimization and image loading
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // If image is already loaded
                if (img.complete && img.naturalHeight !== 0) {
                    img.classList.add('loaded');
                } else {
                    img.onload = function() {
                        this.classList.add('loaded');
                    };
                    
                    img.onerror = function() {
                        this.style.opacity = '0.5';
                        console.warn('Failed to load image:', this.src);
                    };
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        img.classList.remove('loaded');
        imageObserver.observe(img);
    });
}

// Call image optimization
optimizeImages();

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-red) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Console branding
console.log(`
%c🏎️ F1Circuits.in - Drive Your Passion Home! 🏎️
%cWebsite built with passion for Formula 1 racing
%cFor inquiries: https://wa.me/918121612298
`, 
'color: #dc143c; font-size: 20px; font-weight: bold;',
'color: #888; font-size: 14px;',
'color: #25d366; font-size: 12px;'
);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
