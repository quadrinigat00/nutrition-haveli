/**
 * ============================================
 * NUTRITION HAVELI - Main JavaScript File
 * ============================================
 * 
 * This file handles:
 * - Language toggle (English/Hindi)
 * - Mobile menu functionality
 * - Scroll effects (back to top button, header scroll)
 * - Smooth scrolling for navigation links
 * - Dynamic year update
 * 
 * Author: Nutrition Haveli
 * Date: 2024
 */

// ============================================
// DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initLanguageToggle();
    initMobileMenu();
    initScrollEffects();
    initSmoothScroll();
    updateCurrentYear();
    initLazyLoading();
});


// ============================================
// LANGUAGE TOGGLE FUNCTIONALITY
// ============================================
function initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    const langEn = langToggle.querySelector('.lang-en');
    const langHi = langToggle.querySelector('.lang-hi');
    
    let currentLang = 'en';
    
    langToggle.addEventListener('click', function() {
        // Toggle language
        if (currentLang === 'en') {
            currentLang = 'hi';
            langEn.classList.remove('active');
            langHi.classList.add('active');
            setLanguage('hi');
        } else {
            currentLang = 'en';
            langHi.classList.remove('active');
            langEn.classList.add('active');
            setLanguage('en');
        }
    });
    
    function setLanguage(lang) {
        const body = document.body;
        
        if (lang === 'hi') {
            body.classList.add('hindi');
        } else {
            body.classList.remove('hindi');
        }
        
        // Update all elements with data-en and data-hi attributes
        updateLanguageContent(lang);
    }
    
    function updateLanguageContent(lang) {
        // Elements with data-en and data-hi attributes
        const elements = document.querySelectorAll('[data-en][data-hi]');
        
        elements.forEach(function(element) {
            if (lang === 'hi') {
                if (element.hasAttribute('data-hi')) {
                    element.textContent = element.getAttribute('data-hi');
                }
            } else {
                if (element.hasAttribute('data-en')) {
                    element.textContent = element.getAttribute('data-en');
                }
            }
        });
        
        // Store language preference in localStorage
        localStorage.setItem('nutritionHaveliLang', lang);
    }
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('nutritionHaveliLang');
    if (savedLang) {
        if (savedLang === 'hi') {
            currentLang = 'hi';
            langEn.classList.remove('active');
            langHi.classList.add('active');
            setLanguage('hi');
        }
    }
}


// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    const backToTopBtn = document.getElementById('back-to-top');
    const header = document.getElementById('header');
    
    // Back to top button visibility
    window.addEventListener('scroll', function() {
        // Show/hide back to top button
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Header background on scroll
        if (window.pageYOffset > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Back to top button click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}


// ============================================
// UPDATE CURRENT YEAR
// ============================================
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}


// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // Select all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}


// ============================================
// WHATSAPP BUTTON TRACKING (Optional)
// ============================================
function trackWhatsAppClick(productName) {
    // You can add analytics tracking here
    console.log('WhatsApp clicked for product: ' + productName);
}


// ============================================
// FORM SUBMISSION HANDLER (For future use)
// ============================================
function handleInquiryForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Here you would typically send data to your backend
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your inquiry! We will contact you soon.');
    
    // Reset form
    event.target.reset();
}


// ============================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================

// Format phone number for WhatsApp
function formatWhatsAppNumber(phone) {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
}

// Generate WhatsApp link with pre-filled message
function generateWhatsAppLink(phone, message) {
    const formattedPhone = formatWhatsAppNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================
window.NutritionHaveli = {
    trackWhatsAppClick: trackWhatsAppClick,
    generateWhatsAppLink: generateWhatsAppLink,
    formatWhatsAppNumber: formatWhatsAppNumber,
    debounce: debounce,
    throttle: throttle
};


/* ============================================
   END OF JAVASCRIPT FILE
   ============================================ */
