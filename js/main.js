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
    initHeroCinematicAnimation();
    initProductsEnhancements();
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
// HERO CINEMATIC ENTRANCE ANIMATION
// ============================================
function initHeroCinematicAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelectorAll('.hero-cta .btn');

    if (!heroTitle || !heroSubtitle || !heroButtons.length) return;

    gsap.set([heroTitle, heroSubtitle], {
        opacity: 0,
        scale: 1.2,
        filter: 'blur(16px)',
        transformOrigin: 'center center'
    });

    gsap.set(heroButtons, {
        opacity: 0,
        y: 40,
        transformOrigin: 'center center'
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(heroTitle, {
        duration: 1.1,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        y: 0
    })
    .to(heroSubtitle, {
        duration: 0.9,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        y: 0
    }, '-=0.65')
    .to(heroButtons, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.2');
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

// ============================================
// CLICK-TO-ZOOM MODAL (Why Choose Us)
// ============================================
(function initWhyChooseUsZoomModal() {
    const section = document.querySelector('#why-choose-us');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.feature-card'));
    if (cards.length < 3) return;

    const options = [
        {
            key: 'affordable',
            title: 'Affordable Price',
            iconClass: 'fas fa-tags',
            description: 'While the market prices are high, we provide you with top-quality authentic supplements at the most honest and affordable rates.'
        },
        {
            key: 'genuine',
            title: '100% Genuine Supplements',
            iconClass: 'fas fa-shield-alt',
            description: 'Zero compromises on your health. Every single product is directly sourced and 100% authentic, complete with brand verification.'
        },
        {
            key: 'gym',
            title: 'Gym-Focused Expert Selection',
            iconClass: 'fas fa-dumbbell',
            description: 'No random products. Our inventory is curated by fitness experts specifically tailored to maximize your gym performance and results.'
        }
    ];

    // Create overlay + card dynamically (no HTML changes needed)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Why choose us details');

    const modalCard = document.createElement('div');
    modalCard.className = 'modal-card';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = 'X';

    const inner = document.createElement('div');
    inner.className = 'modal-card-inner';

    const left = document.createElement('div');
    left.className = 'modal-left';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'modal-icon';

    const titleEl = document.createElement('div');
    titleEl.className = 'modal-title';

    left.appendChild(iconWrap);
    left.appendChild(titleEl);

    const right = document.createElement('div');
    right.className = 'modal-right';

    const desc = document.createElement('div');
    desc.className = 'modal-description';

    right.appendChild(desc);

    inner.appendChild(left);
    inner.appendChild(right);

    modalCard.appendChild(closeBtn);
    modalCard.appendChild(inner);

    overlay.appendChild(modalCard);
    document.body.appendChild(overlay);

    let active = false;
    let lastFocus = null;

    function openModal(index) {
        const data = options[index];
        if (!data) return;

        lastFocus = document.activeElement;
        active = true;

        iconWrap.innerHTML = `<i class="${data.iconClass}"></i>`;
        titleEl.textContent = data.title;
        desc.textContent = data.description;

        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');
        closeBtn.focus();
    }

    function closeModal() {
        if (!active) return;
        active = false;

        overlay.classList.remove('active');
        document.body.style.overflow = '';

        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    // Click listeners for the 3 cards
    cards.slice(0, 3).forEach((card, idx) => {
        card.style.cursor = 'pointer';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('click', function () {
            openModal(idx);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(idx);
            }
        });
    });

    // Close on X
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
    });

    // Close on outside click (overlay backdrop)
    overlay.addEventListener('click', function () {
        closeModal();
    });

    // Prevent close when clicking inside the modal card
    modalCard.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
})();

// ============================================
// CINEMATIC HERO ENTRANCE (TEXT + BUTTONS)
// ============================================
function initHeroCinematicAnimation() {

    if (typeof gsap === 'undefined') return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const hero = document.querySelector('[data-hero-brand]');
    if (!hero) return;

    const brand = document.querySelector('.hero-brand');
    const subtitle = hero.querySelector('.hero-subtitle');
    const ctas = hero.querySelectorAll('.hero-cta .btn');

    if (!brand || !subtitle || !ctas || ctas.length < 2) return;

    // Initial state
    gsap.set(brand, {
        opacity: 0,
        scale: 1.07,
        filter: 'blur(14px) brightness(1.2)'
    });
    gsap.set(subtitle, {
        opacity: 0,
        y: 14,
        scale: 1.02,
        filter: 'blur(8px) brightness(1.1)'
    });
    ctas.forEach((btn, i) => {
        gsap.set(btn, {
            opacity: 0,
            y: 24,
            filter: 'blur(6px)'
        });
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Cinematic smoky/zoom-out reveal
    tl.to(brand, {
        duration: 1.15,
        opacity: 1,
        scale: 0.98,
        filter: 'blur(0px) brightness(1)'
    }, 0);

    tl.to(subtitle, {
        duration: 0.9,
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)'
    }, 0.35);

    // Button entrance right after text
    tl.to(ctas[0], {
        duration: 0.8,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
    }, 0.95);

    tl.to(ctas[1], {
        duration: 0.8,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
    }, 1.05);

    return tl;
}


/* ============================================
   PRODUCTS UI ENHANCEMENTS
   ============================================ */

function initProductsEnhancements() {
    const productsSection = document.querySelector('#products');
    if (!productsSection) return;

    const cards = Array.from(productsSection.querySelectorAll('.product-card'));
    if (!cards.length) return;

    const state = window.__nutritionHaveliEcomState || (window.__nutritionHaveliEcomState = {
        cart: [],
        wishlist: []
    });

    const CART_TAB = 'my-cart';
    const WISHLIST_TAB = 'my-wishlist';
    let sidebarBridgeOpen = null;
    let sidebarBridgeClose = null;
    let sidebarBridgeSetTab = null;
    let sidebarBridgeUpdateUI = null;

    const heartSvg = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path class="heart-outline" d="M12 21s-7.2-4.6-9.4-8.9C.8 8.7 2.4 5.6 5.6 5.1c1.7-.3 3.3.4 4.4 1.6 1.1-1.2 2.7-1.9 4.4-1.6 3.2.5 4.8 3.6 3 7-2.2 4.3-9.4 8.9-9.4 8.9z"/>
        </svg>
    `;

    function buildProductData(card, idx) {
        const name = (card.querySelector('.product-name')?.textContent || '').trim() || `Product ${idx + 1}`;
        const desc = (card.querySelector('.product-desc')?.textContent || '').trim();
        const img = card.querySelector('.product-image img');
        const imgSrc = img?.getAttribute('src') || '';
        const imgAlt = img?.getAttribute('alt') || name;
        const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const base = 999 + idx * 250;
        const mrp = base + 350;
        const market = base;
        const our = Math.max(199, Math.round(base * 0.74));
        const benefitsList = [
            'Supports performance & recovery',
            'Quality ingredients for consistent results',
            'Designed for everyday gym progress'
        ];

        if (idx % 2 === 1) {
            benefitsList.unshift('Helps improve strength & stamina');
            benefitsList.pop();
        }

        return { key, name, desc, imgSrc, imgAlt, mrp, market, our, benefitsList };
    }

    function updateHeaderBadges() {
        const cartBadge = document.querySelector('[data-cart-badge]');
        const wishlistBadge = document.querySelector('[data-wishlist-badge]');
        const cartTotal = state.cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartBadge) cartBadge.textContent = cartTotal;
        if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;
    }

    function syncHeartButtons() {
        cards.forEach((card) => {
            const btn = card.querySelector('.product-like-btn');
            if (!btn) return;
            const key = card.dataset.productKey;
            const isLiked = state.wishlist.some((item) => item.key === key);
            btn.classList.toggle('liked', isLiked);
            btn.dataset.liked = isLiked ? 'true' : 'false';
            btn.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
        });
    }

    function addItemToCart(productData) {
        const existing = state.cart.find((item) => item.key === productData.key);
        if (existing) {
            existing.qty += 1;
        } else {
            state.cart.push({ ...productData, qty: 1 });
        }

        updateHeaderBadges();
        if (typeof updateSidebarUI === 'function') {
            updateSidebarUI();
        }

        const liveRegion = document.getElementById('cart-live-region') || ensureLiveRegion();
        liveRegion.textContent = `${productData.name} added to cart.`;
    }

    function toggleWishlist(productData) {
        const existingIndex = state.wishlist.findIndex((item) => item.key === productData.key);
        if (existingIndex >= 0) {
            state.wishlist.splice(existingIndex, 1);
        } else {
            state.wishlist.push({ ...productData });
        }

        syncHeartButtons();
        updateHeaderBadges();
        if (typeof updateSidebarUI === 'function') {
            updateSidebarUI();
        }
    }

    function ensureLiveRegion() {
        const el = document.createElement('div');
        el.id = 'cart-live-region';
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'true');
        el.style.position = 'absolute';
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.overflow = 'hidden';
        el.style.clip = 'rect(1px, 1px, 1px, 1px)';
        el.style.whiteSpace = 'nowrap';
        el.style.border = '0';
        el.style.padding = '0';
        document.body.appendChild(el);
        return el;
    }

    function ensureHeaderTriggers() {
        const actions = document.querySelector('.header-actions');
        if (!actions) return;

        let cartBtn = actions.querySelector('[data-sidebar-cart]');
        let wishlistBtn = actions.querySelector('[data-sidebar-wishlist]');

        if (!cartBtn) {
            cartBtn = document.createElement('button');
            cartBtn.type = 'button';
            cartBtn.className = 'header-icon-btn';
            cartBtn.dataset.sidebarCart = 'true';
            cartBtn.setAttribute('aria-label', 'Open cart');
            cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="header-icon-badge" data-cart-badge>0</span>';
        }

        if (!wishlistBtn) {
            wishlistBtn = document.createElement('button');
            wishlistBtn.type = 'button';
            wishlistBtn.className = 'header-icon-btn';
            wishlistBtn.dataset.sidebarWishlist = 'true';
            wishlistBtn.setAttribute('aria-label', 'Open wishlist');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span class="header-icon-badge" data-wishlist-badge>0</span>';
        }

        if (!cartBtn.parentNode) {
            const mobileToggle = actions.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                actions.insertBefore(cartBtn, mobileToggle);
                actions.insertBefore(wishlistBtn, mobileToggle);
            } else {
                actions.appendChild(cartBtn);
                actions.appendChild(wishlistBtn);
            }
        }

        if (!cartBtn.dataset.bound) {
            cartBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof sidebarBridgeOpen === 'function') {
                    sidebarBridgeOpen(CART_TAB);
                }
            });
            cartBtn.dataset.bound = 'true';
        }

        if (!wishlistBtn.dataset.bound) {
            wishlistBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof sidebarBridgeOpen === 'function') {
                    sidebarBridgeOpen(WISHLIST_TAB);
                }
            });
            wishlistBtn.dataset.bound = 'true';
        }

        updateHeaderBadges();
    }

    cards.forEach((card, idx) => {
        const imageWrap = card.querySelector('.product-image');
        const info = card.querySelector('.product-info');
        if (!imageWrap || !info) return;

        const productData = buildProductData(card, idx);
        card.dataset.productKey = productData.key;

        const heartBtnId = `product-like-btn-${idx}`;
        let likeBtn = card.querySelector(`#${heartBtnId}`);
        if (!likeBtn) {
            likeBtn = document.createElement('button');
            likeBtn.type = 'button';
            likeBtn.id = heartBtnId;
            likeBtn.className = 'product-like-btn';
            likeBtn.setAttribute('aria-label', 'Like');
            likeBtn.setAttribute('aria-pressed', 'false');
            likeBtn.dataset.liked = 'false';
            likeBtn.innerHTML = heartSvg;
            imageWrap.appendChild(likeBtn);
        }

        likeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleWishlist(productData);
        });

        if (!info.querySelector('.product-action-row')) {
            const row = document.createElement('div');
            row.className = 'product-action-row';

            const viewBtn = document.createElement('button');
            viewBtn.type = 'button';
            viewBtn.className = 'product-action-btn view-details';
            viewBtn.innerHTML = '<span>View Details</span>';
            viewBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openProductsDetails(productData);
            });

            const cartBtn = document.createElement('button');
            cartBtn.type = 'button';
            cartBtn.className = 'product-action-btn add-to-cart';
            cartBtn.innerHTML = '<span>Add to Cart</span>';
            cartBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                addItemToCart(productData);
            });

            row.appendChild(viewBtn);
            row.appendChild(cartBtn);
            info.appendChild(row);
        }
    });

    syncHeartButtons();
    updateHeaderBadges();

    let activeProduct = null;
    let lastFocus = null;

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'products-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-label', 'Product details');

    const modalCard = document.createElement('div');
    modalCard.className = 'products-modal-card';

    const modalInner = document.createElement('div');
    modalInner.className = 'products-modal-inner';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'products-modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = 'X';

    const modalGrid = document.createElement('div');
    modalGrid.className = 'products-modal-grid';

    const left = document.createElement('div');
    left.className = 'products-modal-image';

    const leftImg = document.createElement('img');
    leftImg.alt = 'Product';
    leftImg.src = '';
    left.appendChild(leftImg);

    const right = document.createElement('div');
    right.className = 'products-modal-right';

    const titleEl = document.createElement('h3');
    titleEl.className = 'products-modal-title';

    const descEl = document.createElement('div');
    descEl.className = 'products-modal-desc';

    const benefits = document.createElement('div');
    benefits.className = 'products-benefits';

    const benefitsH = document.createElement('h4');
    benefitsH.textContent = 'Product Profits/Benefits';

    const benefitsUl = document.createElement('ul');
    benefits.appendChild(benefitsH);
    benefits.appendChild(benefitsUl);

    const price = document.createElement('div');
    price.className = 'price-breakdown';

    const mrpRow = document.createElement('div');
    mrpRow.className = 'price-row';
    mrpRow.innerHTML = '<span class="price-label">MRP:</span>';
    const rowMrpVal = document.createElement('span');
    rowMrpVal.className = 'price-mrp';
    mrpRow.appendChild(rowMrpVal);

    const marketRow = document.createElement('div');
    marketRow.className = 'price-row';
    marketRow.innerHTML = '<span class="price-label">Actual Market Price:</span>';
    const rowMarketVal = document.createElement('span');
    rowMarketVal.className = 'price-market';
    marketRow.appendChild(rowMarketVal);

    const ourRow = document.createElement('div');
    ourRow.className = 'price-row';
    ourRow.innerHTML = '<span class="price-label">Our Price:</span>';
    const rowOurVal = document.createElement('span');
    rowOurVal.className = 'price-our';
    ourRow.appendChild(rowOurVal);

    price.appendChild(mrpRow);
    price.appendChild(marketRow);
    price.appendChild(ourRow);

    right.appendChild(titleEl);
    right.appendChild(descEl);
    right.appendChild(benefits);
    right.appendChild(price);

    modalGrid.appendChild(left);
    modalGrid.appendChild(right);

    modalCard.appendChild(closeBtn);
    modalInner.appendChild(modalGrid);
    modalCard.appendChild(modalInner);
    modalOverlay.appendChild(modalCard);
    document.body.appendChild(modalOverlay);

    function formatINR(value) {
        const num = Number(value) || 0;
        return '₹' + num.toLocaleString('en-IN');
    }

    function openProductsDetails(productData) {
        activeProduct = productData;
        lastFocus = document.activeElement;

        titleEl.textContent = productData.name;
        descEl.textContent = productData.desc || '';
        leftImg.src = productData.imgSrc;
        leftImg.alt = productData.imgAlt;

        benefitsUl.innerHTML = '';
        productData.benefitsList.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            benefitsUl.appendChild(li);
        });

        rowMrpVal.textContent = formatINR(productData.mrp);
        rowMarketVal.textContent = formatINR(productData.market);
        rowOurVal.textContent = formatINR(productData.our);

        document.body.style.overflow = 'hidden';
        modalOverlay.classList.add('active');
        closeBtn.focus();
    }

    function closeProductsDetails() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        activeProduct = null;
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeProductsDetails();
    });

    modalOverlay.addEventListener('click', function () {
        closeProductsDetails();
    });

    modalCard.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeProductsDetails();
        }
    });

    let activeTab = CART_TAB;

    function ensureSidebarUI() {
        let overlay = document.querySelector('.ecommerce-sidebar-overlay');
        let sidebar = document.querySelector('.ecommerce-sidebar');

        if (!overlay || !sidebar) {
            overlay = document.createElement('div');
            overlay.className = 'ecommerce-sidebar-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(overlay);

            sidebar = document.createElement('aside');
            sidebar.className = 'ecommerce-sidebar';
            sidebar.setAttribute('role', 'dialog');
            sidebar.setAttribute('aria-modal', 'true');
            sidebar.setAttribute('aria-label', 'Shopping cart and wishlist');
            document.body.appendChild(sidebar);
        }

        if (!sidebar.querySelector('.ecommerce-sidebar-header')) {
            const header = document.createElement('div');
            header.className = 'ecommerce-sidebar-header';

            const title = document.createElement('div');
            title.className = 'ecommerce-sidebar-title';
            title.textContent = 'My Cart';

            const closeBtnSidebar = document.createElement('button');
            closeBtnSidebar.type = 'button';
            closeBtnSidebar.className = 'ecommerce-sidebar-close';
            closeBtnSidebar.setAttribute('aria-label', 'Close');
            closeBtnSidebar.innerHTML = '&times;';

            header.appendChild(title);
            header.appendChild(closeBtnSidebar);

            const body = document.createElement('div');
            body.className = 'ecommerce-sidebar-body';

            const tabs = document.createElement('div');
            tabs.className = 'ecommerce-tabs';

            const tabCart = document.createElement('button');
            tabCart.type = 'button';
            tabCart.className = 'ecommerce-tab active';
            tabCart.dataset.tab = CART_TAB;
            tabCart.textContent = 'My Cart';

            const tabWishlist = document.createElement('button');
            tabWishlist.type = 'button';
            tabWishlist.className = 'ecommerce-tab';
            tabWishlist.dataset.tab = WISHLIST_TAB;
            tabWishlist.textContent = 'My Wishlist';

            tabs.appendChild(tabCart);
            tabs.appendChild(tabWishlist);

            const cartPanel = document.createElement('section');
            cartPanel.className = 'ecommerce-tab-panel';
            cartPanel.dataset.panel = CART_TAB;

            const cartList = document.createElement('div');
            cartList.className = 'ecommerce-list';

            const wishlistPanel = document.createElement('section');
            wishlistPanel.className = 'ecommerce-tab-panel';
            wishlistPanel.dataset.panel = WISHLIST_TAB;
            wishlistPanel.style.display = 'none';

            const wishList = document.createElement('div');
            wishList.className = 'ecommerce-list';

            const cartFooter = document.createElement('div');
            cartFooter.className = 'ecommerce-cart-footer';
            const cartFooterInner = document.createElement('div');
            cartFooterInner.className = 'ecommerce-cart-footer-inner';

            const totalLabel = document.createElement('div');
            totalLabel.className = 'ecommerce-total-label';

            const totalTitle = document.createElement('div');
            totalTitle.className = 'ecommerce-total-title';
            totalTitle.textContent = 'Total Price:';

            const totalPrice = document.createElement('div');
            totalPrice.className = 'ecommerce-total-price';
            totalPrice.textContent = '₹ 0';

            totalLabel.appendChild(totalTitle);
            totalLabel.appendChild(totalPrice);

            const orderBtn = document.createElement('button');
            orderBtn.type = 'button';
            orderBtn.className = 'ecommerce-order-btn';
            orderBtn.textContent = 'Order Now';
            orderBtn.addEventListener('click', function () {
                const message = state.cart.map((item) => `${item.name} x${item.qty}`).join(', ');
                const url = `https://wa.me/919827676474?text=${encodeURIComponent(`Hello, I want to order: ${message || 'products'}`)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
            });

            cartFooterInner.appendChild(totalLabel);
            cartFooterInner.appendChild(orderBtn);
            cartFooter.appendChild(cartFooterInner);

            cartPanel.appendChild(cartList);
            cartPanel.appendChild(cartFooter);
            wishlistPanel.appendChild(wishList);

            body.appendChild(tabs);
            body.appendChild(cartPanel);
            body.appendChild(wishlistPanel);

            sidebar.appendChild(header);
            sidebar.appendChild(body);

            function renderCart() {
                cartList.innerHTML = '';
                const items = state.cart;
                if (!items.length) {
                    const empty = document.createElement('div');
                    empty.className = 'ecommerce-cart-item';
                    empty.textContent = 'Your cart is empty.';
                    cartList.appendChild(empty);
                } else {
                    items.forEach((item, index) => {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'ecommerce-cart-item';

                        const row = document.createElement('div');
                        row.className = 'ecommerce-cart-row';

                        const itemBody = document.createElement('div');
                        itemBody.className = 'ecommerce-item-body';

                        const serial = document.createElement('div');
                        serial.className = 'ecommerce-item-serial';
                        serial.textContent = `${index + 1}.`;

                        const thumb = document.createElement('div');
                        thumb.className = 'ecommerce-item-thumb';
                        const img = document.createElement('img');
                        img.src = item.imgSrc || '';
                        img.alt = item.imgAlt || item.name;
                        thumb.appendChild(img);

                        const meta = document.createElement('div');
                        meta.className = 'ecommerce-cart-meta';

                        const name = document.createElement('div');
                        name.className = 'ecommerce-item-name';
                        name.textContent = item.name;

                        const sub = document.createElement('div');
                        sub.className = 'ecommerce-item-sub';
                        sub.textContent = `Qty ${item.qty} • ₹${(item.our * item.qty).toLocaleString('en-IN')}`;

                        meta.appendChild(name);
                        meta.appendChild(sub);

                        const actions = document.createElement('div');
                        actions.className = 'ecommerce-item-actions';

                        const trash = document.createElement('button');
                        trash.type = 'button';
                        trash.className = 'ecommerce-trash-btn';
                        trash.setAttribute('aria-label', `Remove ${item.name}`);
                        trash.innerHTML = '<i class="fas fa-trash"></i>';
                        trash.addEventListener('click', function () {
                            const idx = state.cart.findIndex((entry) => entry.key === item.key);
                            if (idx >= 0) {
                                state.cart.splice(idx, 1);
                            }
                            updateHeaderBadges();
                            updateSidebarUI();
                        });

                        itemBody.appendChild(serial);
                        itemBody.appendChild(thumb);
                        itemBody.appendChild(meta);
                        actions.appendChild(trash);
                        row.appendChild(itemBody);
                        row.appendChild(actions);
                        wrapper.appendChild(row);
                        cartList.appendChild(wrapper);
                    });
                }

                const total = state.cart.reduce((sum, item) => sum + item.our * item.qty, 0);
                totalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
            }

            function renderWishlist() {
                wishList.innerHTML = '';
                const items = state.wishlist;
                if (!items.length) {
                    const empty = document.createElement('div');
                    empty.className = 'ecommerce-wishlist-item';
                    empty.textContent = 'Your wishlist is empty.';
                    wishList.appendChild(empty);
                } else {
                    items.forEach((item, index) => {
                        const wItem = document.createElement('div');
                        wItem.className = 'ecommerce-wishlist-item';

                        const itemBody = document.createElement('div');
                        itemBody.className = 'ecommerce-item-body';

                        const serial = document.createElement('div');
                        serial.className = 'ecommerce-item-serial';
                        serial.textContent = `${index + 1}.`;

                        const thumb = document.createElement('div');
                        thumb.className = 'ecommerce-item-thumb';
                        const img = document.createElement('img');
                        img.src = item.imgSrc || '';
                        img.alt = item.imgAlt || item.name;
                        thumb.appendChild(img);

                        const meta = document.createElement('div');
                        meta.className = 'ecommerce-wishlist-meta';

                        const name = document.createElement('div');
                        name.className = 'ecommerce-item-name';
                        name.textContent = item.name;

                        const sub = document.createElement('div');
                        sub.className = 'ecommerce-item-sub';
                        sub.textContent = `₹${item.our.toLocaleString('en-IN')} • Loved item`;

                        meta.appendChild(name);
                        meta.appendChild(sub);

                        const removeBtn = document.createElement('button');
                        removeBtn.type = 'button';
                        removeBtn.className = 'ecommerce-wish-remove';
                        removeBtn.setAttribute('aria-label', `Remove ${item.name}`);
                        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                        removeBtn.addEventListener('click', function () {
                            const idx = state.wishlist.findIndex((entry) => entry.key === item.key);
                            if (idx >= 0) {
                                state.wishlist.splice(idx, 1);
                            }
                            syncHeartButtons();
                            updateHeaderBadges();
                            updateSidebarUI();
                        });

                        itemBody.appendChild(serial);
                        itemBody.appendChild(thumb);
                        itemBody.appendChild(meta);
                        wItem.appendChild(itemBody);
                        wItem.appendChild(removeBtn);
                        wishList.appendChild(wItem);
                    });
                }
            }

            function updateSidebarUI() {
                const activeTab = window.__nutritionHaveliSidebarTab || CART_TAB;
                tabCart.classList.toggle('active', activeTab === CART_TAB);
                tabWishlist.classList.toggle('active', activeTab === WISHLIST_TAB);
                cartPanel.style.display = activeTab === CART_TAB ? '' : 'none';
                wishlistPanel.style.display = activeTab === WISHLIST_TAB ? '' : 'none';
                title.textContent = activeTab === CART_TAB ? 'My Cart' : 'My Wishlist';
                if (activeTab === CART_TAB) {
                    renderCart();
                    cartFooter.style.display = '';
                } else {
                    renderWishlist();
                    cartFooter.style.display = 'none';
                }
            }

            function setTab(tabKey) {
                window.__nutritionHaveliSidebarTab = tabKey;
                updateSidebarUI();
            }

            let lastFocusSidebar = null;
            function openSidebar(tabKey) {
                lastFocusSidebar = document.activeElement;
                window.__nutritionHaveliSidebarTab = tabKey;
                overlay.classList.add('active');
                sidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
                updateSidebarUI();
                closeBtnSidebar.focus();
                overlay.setAttribute('aria-hidden', 'false');
            }

            function closeSidebar() {
                overlay.classList.remove('active');
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
                overlay.setAttribute('aria-hidden', 'true');
                if (lastFocusSidebar && typeof lastFocusSidebar.focus === 'function') {
                    lastFocusSidebar.focus();
                }
            }

            tabCart.addEventListener('click', function () {
                setTab(CART_TAB);
            });

            tabWishlist.addEventListener('click', function () {
                setTab(WISHLIST_TAB);
            });

            closeBtnSidebar.addEventListener('click', function (e) {
                e.stopPropagation();
                closeSidebar();
            });

            overlay.addEventListener('click', function () {
                closeSidebar();
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                    closeSidebar();
                }
            });

            sidebarBridgeOpen = openSidebar;
            sidebarBridgeClose = closeSidebar;
            sidebarBridgeSetTab = setTab;
            sidebarBridgeUpdateUI = updateSidebarUI;

            ensureHeaderTriggers();
            updateSidebarUI();
            updateHeaderBadges();
            window.__ecommerceSidebar = { openSidebar, closeSidebar, setTab, updateSidebarUI };
        }

        ensureHeaderTriggers();
        updateHeaderBadges();
        if (typeof window.__ecommerceSidebar?.updateSidebarUI === 'function') {
            window.__ecommerceSidebar.updateSidebarUI();
        }
    }

    ensureSidebarUI();
}

/* ============================================
   END OF JAVASCRIPT FILE
   ============================================ */

