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

    // Render dynamic products first, so initProductsEnhancements can bind handlers.
    renderInventoryProductsToGrid();
    initProductsEnhancements();

    initInteractiveCards();
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
   INTERACTIVE CARD TOGGLE ENHANCEMENTS
   ============================================ */
function initInteractiveCards() {
    const guaranteeCards = Array.from(document.querySelectorAll('#guarantees .guarantee-card'));
    guaranteeCards.forEach((card) => {
        card.classList.add('clickable-card');
        card.style.cursor = 'pointer';

        card.addEventListener('click', function (event) {
            if (event.target.closest('a, button')) return;

            const shouldActivate = !card.classList.contains('active');
            guaranteeCards.forEach((item) => {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            if (shouldActivate) {
                card.classList.add('active');
                card.setAttribute('aria-expanded', 'true');
            }
        });

        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });
    });

    const deliveryCard = document.querySelector('#delivery .delivery-card');
    if (deliveryCard) {
        deliveryCard.classList.add('clickable-card');
        deliveryCard.style.cursor = 'pointer';

        deliveryCard.addEventListener('click', function (event) {
            if (event.target.closest('a, button')) return;

            const shouldActivate = !deliveryCard.classList.contains('active');
            deliveryCard.classList.toggle('active', shouldActivate);
            deliveryCard.setAttribute('aria-expanded', String(shouldActivate));
        });

        deliveryCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                deliveryCard.click();
            }
        });
    }
}

/* ============================================
   PRODUCTS UI ENHANCEMENTS
   ============================================ */

function renderInventoryProductsToGrid() {
    const grid = document.querySelector('#products-grid') || document.querySelector('.products-grid');
    if (!grid) return;

    const escapeHtml = (str) => String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');

    grid.innerHTML = '';

    openNutritionHaveliDB('products')
        .then(fetchAllProductsFromDB)
        .then((products) => {
            if (!Array.isArray(products)) return;

            const byCategory = new Map();
            products.forEach((p, idx) => {
                const category = (p.category || 'Uncategorized').toString();
                if (!byCategory.has(category)) byCategory.set(category, []);
                byCategory.get(category).push({ p, idx });
            });

            const categoryOrder = Array.from(byCategory.keys());
            categoryOrder.forEach((cat) => {
                const heading = document.createElement('div');
                heading.className = 'product-category-heading';
                heading.style.gridColumn = '1 / -1';
                heading.style.marginTop = '18px';
                heading.style.marginBottom = '6px';
                heading.style.fontWeight = '1000';
                heading.style.color = 'rgba(255,255,255,.92)';
                heading.style.letterSpacing = '.2px';
                heading.textContent = cat;
                grid.appendChild(heading);

                byCategory.get(cat).forEach(({ p, idx }) => {
                    const id = p.id ?? p.key ?? p.productId ?? p._id ?? `inv-${idx}`;
                    const name = p.name ?? p.title ?? `Product ${idx + 1}`;
                    const desc = p.description ?? p.details ?? p.desc ?? '';

                    const imageLinks = Array.isArray(p.imageLinks) ? p.imageLinks : null;
                    const imageLink = (imageLinks && imageLinks.length ? imageLinks[0] : (p.imageLink ?? p.image ?? p.img ?? ''));

                    const badgeText = p.badge ?? (idx === 0 ? 'Best Seller' : '');

                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.dataset.productId = String(id);
                    card.dataset.mrp = String(p.mrpPrice ?? p.price ?? p.ourPrice ?? 0);
                    card.dataset.market = String(p.marketPrice ?? p.market ?? 0);
                    card.dataset.our = String(p.ourPrice ?? p.price ?? 0);
                    card.dataset.productDesc = String(desc);
                    card.dataset.imageLinks = JSON.stringify(Array.isArray(p.imageLinks) ? p.imageLinks : []);
                    card.dataset.videoLink = String(p.videoLink ?? p.video ?? '');

                    const cardPriceAnchorText = `I want to buy ${name}`;

                    card.innerHTML = `
                        <div class="product-image">
                            <img src="${escapeHtml(imageLink)}" alt="${escapeHtml(name)}" onerror="this.style.display='none';" />
                            ${badgeText ? `<span class="product-badge">${escapeHtml(badgeText)}</span>` : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${escapeHtml(name)}</h3>
                            <p class="product-desc">${escapeHtml(desc)}</p>
                            <a href="https://wa.me/919827676474?text=${encodeURIComponent(cardPriceAnchorText)}" class="btn btn-product" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-whatsapp"></i>
                                <span>Order Now</span>
                            </a>
                        </div>
                    `;

                    grid.appendChild(card);
                });
            });

            // Ensure enhancements bind to freshly rendered cards
            initProductsEnhancements();
        })
        .catch((err) => {
            console.error('Failed to render products from IndexedDB:', err);
        });
}

function openNutritionHaveliDB(storeName) {
    const DB_NAME = 'NutritionHaveliDB';
    const DB_VERSION = 1;

    return new Promise((resolve, reject) => {
        try {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = function (e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            };
            req.onsuccess = function () {
                resolve(req.result);
            };
            req.onerror = function () {
                reject(req.error || new Error('Failed to open NutritionHaveliDB'));
            };
        } catch (err) {
            reject(err);
        }
    });
}

function fetchAllProductsFromDB(db) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(['products'], 'readonly');
            const store = tx.objectStore('products');
            const req = store.getAll();
            req.onsuccess = function () {
                resolve(Array.isArray(req.result) ? req.result : []);
            };
            req.onerror = function () {
                reject(req.error || new Error('Failed to fetch products'));
            };
            tx.oncomplete = function () {
                try { db.close(); } catch {}
            };
            tx.onabort = function () {
                try { db.close(); } catch {}
            };
        } catch (err) {
            reject(err);
        }
    });
}




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
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutGrandTotal = document.getElementById('checkout-grand-total');
    const checkoutNameInput = document.getElementById('checkout-name');
    const checkoutPhoneInput = document.getElementById('checkout-phone');
    const checkoutAddressInput = document.getElementById('checkout-address');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutFormMessage = document.getElementById('checkout-form-message');
    let activeCheckoutItems = [];

    function enforcePhoneInput() {
        if (!checkoutPhoneInput) return;

        const prefix = '+91 ';
        checkoutPhoneInput.setAttribute('type', 'tel');
        checkoutPhoneInput.setAttribute('inputmode', 'numeric');
        checkoutPhoneInput.setAttribute('placeholder', `${prefix}9876543210`);
        checkoutPhoneInput.setAttribute('maxlength', '14');

        const applyPhoneValue = () => {
            const digits = (checkoutPhoneInput.value.replace(/\D/g, '').slice(2) || '').slice(0, 10);
            checkoutPhoneInput.value = digits ? `${prefix}${digits}` : prefix;
        };

        checkoutPhoneInput.addEventListener('input', applyPhoneValue);
        checkoutPhoneInput.addEventListener('focus', function () {
            if (!checkoutPhoneInput.value || checkoutPhoneInput.value === prefix) {
                checkoutPhoneInput.value = prefix;
            }
        });
        checkoutPhoneInput.addEventListener('blur', applyPhoneValue);
        checkoutPhoneInput.value = prefix;
    }

    function formatINR(value) {
        const num = Number(value) || 0;
        return '₹' + num.toLocaleString('en-IN');
    }

    function openCheckoutModal(items, options) {
        const normalizedItems = (items || []).map((item) => ({
            ...item,
            quantity: item.quantity || item.qty || 1
        }));

        activeCheckoutItems = normalizedItems;

        if (options?.clearCart) {
            state.cart = [];
        }

        if (!checkoutModal) return;

        checkoutItemsList.innerHTML = '';
        const total = normalizedItems.reduce((sum, item) => sum + item.our * (item.quantity || 1), 0);
        checkoutGrandTotal.textContent = formatINR(total);

        if (!normalizedItems.length) {
            checkoutItemsList.innerHTML = '<div class="checkout-item-row"><span class="checkout-item-name">No items selected.</span></div>';
        } else {
            normalizedItems.forEach((item) => {
                const row = document.createElement('div');
                row.className = 'checkout-item-row';
                const name = document.createElement('span');
                name.className = 'checkout-item-name';
                name.textContent = `${item.name} ×${item.quantity || 1}`;
                const price = document.createElement('span');
                price.textContent = formatINR(item.our * (item.quantity || 1));
                row.appendChild(name);
                row.appendChild(price);
                checkoutItemsList.appendChild(row);
            });
        }

        checkoutFormMessage.textContent = '';
        checkoutModal.classList.add('active');
        checkoutModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (checkoutNameInput) checkoutNameInput.focus();
    }

    function closeCheckoutModal() {
        if (!checkoutModal) return;
        checkoutModal.classList.remove('active');
        checkoutModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        checkoutForm.reset();
        checkoutFormMessage.textContent = '';
    }

    function buildWhatsAppMessage(items, customer) {
        const lines = [
            '*NUTRITION HAVELI - NEW ORDER* 🔥',
            '----------------------------------',
            '👤 *Customer Details:*',
            `- Name: ${customer.name}`,
            `- Phone: ${customer.phone}`,
            `- Address: ${customer.address}`,
            '',
            '🛒 *Items Ordered:*',
            ...items.map((item) => {
                const quantity = item.quantity || item.qty || 1;
                const total = item.our * quantity;
                return `- ${item.name} (x${quantity}) - ${formatINR(total)}`;
            }),
            '',
            `💰 *Total Amount:* ${formatINR(items.reduce((sum, item) => sum + item.our * (item.quantity || item.qty || 1), 0))}`,
            '----------------------------------'
        ];

        return lines.join('\n');
    }

    if (checkoutModal) {
        enforcePhoneInput();

        checkoutModal.querySelectorAll('[data-close-checkout]').forEach((closeEl) => {
            closeEl.addEventListener('click', closeCheckoutModal);
        });

        checkoutForm?.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = checkoutNameInput?.value.trim() || '';
            const phone = checkoutPhoneInput?.value.trim() || '';
            const address = checkoutAddressInput?.value.trim() || '';

            if (!name || !phone || !address) {
                checkoutFormMessage.textContent = 'Please complete all fields before continuing.';
                return;
            }

          const message = buildWhatsAppMessage(activeCheckoutItems, { name, phone, address });
        
        // =========================================================================
        // 📦 OWNER DASHBOARD LOGS: Save Order to LocalStorage before redirecting
        // =========================================================================
        try {
            const orderLogData = {
                dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                customerName: name || 'Guest Customer', 
                customerPhone: phone || 'No Phone',
                customerAddress: address || 'No Address',
                // Map fields based on checkout item shape from this file:
                // item.name, item.our, item.quantity
                items: (activeCheckoutItems || []).map(item => {
                    const qty = item.quantity || item.qty || 1;
                    const unitPrice = Number(item.our || item.price || 0);
                    const title = item.title || item.name || 'Product';
                    const total = unitPrice * qty;
                    return `${title} (Qty: ${qty}) - ₹${total}`;
                }).join(', '),
                // Grand total shown in checkout modal uses #checkout-grand-total
                grandTotal: document.getElementById('checkout-grand-total')?.innerText || '₹0'
            };

            // Pehle se saved orders array nikalna
            let currentOrders = JSON.parse(localStorage.getItem('nutrition_haveli_orders')) || [];
            
            // Naye order ko unshift karke array ke starting (top) par rakhna
            currentOrders.unshift(orderLogData);
            
            // Local storage mein save lock karna
            localStorage.setItem('nutrition_haveli_orders', JSON.stringify(currentOrders));
            console.log("Order successfully saved to Owner Logs! 👑");
        } catch (error) {
            console.error("Error saving order to logs:", error);
        }
        // =========================================================================

        const url = `https://wa.me/919827676474?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        closeCheckoutModal();
        });
    }
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

        const productId = card.dataset.productId;
        const key = productId ? `inv-${productId}` : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const mrp = Number(card.dataset.mrp || 0);
        const market = Number(card.dataset.market || 0);
        const our = Number(card.dataset.our || 0);
        const imageLinks = (() => {
            try {
                return JSON.parse(card.dataset.imageLinks || '[]');
            } catch {
                return [];
            }
        })();
        const videoLink = String(card.dataset.videoLink || '');
        const description = desc || card.dataset.productDesc || '';

        // Expected owner schema fields inside the product record:
        // description, benefit1/2/3, mrpPrice/marketPrice/ourPrice, imageLinks, videoLink
        // Since we render only description/name/image in card HTML, keep a safe benefits fallback.
        const benefitsList = [
            'Supports performance & recovery',
            'Quality ingredients for consistent results',
            'Designed for everyday gym progress'
        ];

        return { key, name, desc: description, imgSrc, imgAlt, mrp, market, our, benefitsList, imageLinks, videoLink };
    }




    function updateHeaderBadges() {
        const cartBadge = document.querySelector('[data-cart-badge]');
        const wishlistBadge = document.querySelector('[data-wishlist-badge]');
        const cartTotal = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            state.cart.push({ ...productData, quantity: 1 });
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

        const existingOrderButton = info.querySelector('.btn-product');
        if (existingOrderButton) {
            existingOrderButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                state.cart = [];
                openCheckoutModal([{ ...productData, quantity: 1 }], { clearCart: true });
            });
        }

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
    let mediaItems = [];
    let activeMediaIndex = 0;
    let touchStartX = null;
    let touchStartY = null;

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

    const leftMedia = document.createElement('div');
    leftMedia.className = 'products-modal-media';

    const leftImg = document.createElement('img');
    leftImg.alt = 'Product';
    leftImg.src = '';
    leftImg.className = 'products-media-image';

    const leftVideo = document.createElement('video');
    leftVideo.controls = true;
    leftVideo.preload = 'metadata';
    leftVideo.style.display = 'none';
    leftVideo.style.width = '100%';
    leftVideo.style.maxHeight = '400px';
    leftVideo.className = 'products-media-video';

    const mediaNav = document.createElement('div');
    mediaNav.className = 'products-media-nav';
<<<<<<< Updated upstream
    mediaNav.style.display = 'flex';
    mediaNav.style.justifyContent = 'space-between';
    mediaNav.style.alignItems = 'center';
    mediaNav.style.marginTop = '10px';
=======
>>>>>>> Stashed changes

    const prevMediaBtn = document.createElement('button');
    prevMediaBtn.type = 'button';
    prevMediaBtn.className = 'products-media-prev';
    prevMediaBtn.textContent = '◀';
<<<<<<< Updated upstream
    prevMediaBtn.disabled = true;

    const mediaCounter = document.createElement('div');
    mediaCounter.className = 'products-media-counter';
    mediaCounter.style.fontSize = '0.9rem';
    mediaCounter.style.color = 'rgba(255,255,255,.75)';
=======
    prevMediaBtn.setAttribute('aria-label', 'Previous media');

    const mediaCounter = document.createElement('div');
    mediaCounter.className = 'products-media-counter';
    mediaCounter.textContent = '';
>>>>>>> Stashed changes

    const nextMediaBtn = document.createElement('button');
    nextMediaBtn.type = 'button';
    nextMediaBtn.className = 'products-media-next';
    nextMediaBtn.textContent = '▶';
<<<<<<< Updated upstream
    nextMediaBtn.disabled = true;
=======
    nextMediaBtn.setAttribute('aria-label', 'Next media');
>>>>>>> Stashed changes

    mediaNav.appendChild(prevMediaBtn);
    mediaNav.appendChild(mediaCounter);
    mediaNav.appendChild(nextMediaBtn);

    leftMedia.appendChild(leftImg);
    leftMedia.appendChild(leftVideo);
    leftMedia.appendChild(mediaNav);
    left.appendChild(leftMedia);

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

<<<<<<< Updated upstream
    let mediaItems = [];
    let activeMediaIndex = 0;

    const isVideoSource = (src) => {
        if (!src || typeof src !== 'string') return false;
        const lower = src.toLowerCase();
        return lower.startsWith('data:video') || lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.includes('video/');
    };

=======
>>>>>>> Stashed changes
    const updateMediaNavigation = () => {
        const count = mediaItems.length;
        mediaCounter.textContent = count ? `${activeMediaIndex + 1}/${count}` : '';
        prevMediaBtn.disabled = activeMediaIndex <= 0;
        nextMediaBtn.disabled = activeMediaIndex >= count - 1;
    };

    const renderProductMedia = () => {
        const item = mediaItems[activeMediaIndex];
        if (!item) {
            leftImg.style.display = 'block';
            leftVideo.style.display = 'none';
            leftVideo.pause();
            leftVideo.src = '';
<<<<<<< Updated upstream
            leftImg.src = '';
            leftImg.alt = 'Product';
=======
            leftImg.src = activeProduct?.imgSrc || '';
            leftImg.alt = activeProduct?.imgAlt || 'Product';
>>>>>>> Stashed changes
            updateMediaNavigation();
            return;
        }

        const showVideo = isVideoSource(item);
        if (showVideo) {
            leftImg.style.display = 'none';
            leftVideo.style.display = 'block';
            leftVideo.src = item;
            leftVideo.alt = 'Product video';
            leftVideo.load();
            leftVideo.currentTime = 0;
        } else {
            leftVideo.pause();
            leftVideo.style.display = 'none';
            leftImg.style.display = 'block';
            leftImg.src = item;
<<<<<<< Updated upstream
            leftImg.alt = (activeProduct && activeProduct.imgAlt) ? activeProduct.imgAlt : 'Product';
=======
            leftImg.alt = activeProduct?.imgAlt || 'Product';
>>>>>>> Stashed changes
        }
        updateMediaNavigation();
    };

<<<<<<< Updated upstream
    prevMediaBtn.addEventListener('click', () => {
=======
    const goToPrevMedia = () => {
>>>>>>> Stashed changes
        if (activeMediaIndex > 0) {
            activeMediaIndex -= 1;
            renderProductMedia();
        }
<<<<<<< Updated upstream
    });

    nextMediaBtn.addEventListener('click', () => {
=======
    };

    const goToNextMedia = () => {
>>>>>>> Stashed changes
        if (activeMediaIndex < mediaItems.length - 1) {
            activeMediaIndex += 1;
            renderProductMedia();
        }
<<<<<<< Updated upstream
    });
=======
    };

    const handleTouchStart = (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        if (touchStartX === null || !event.changedTouches || event.changedTouches.length !== 1) {
            touchStartX = null;
            touchStartY = null;
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                goToPrevMedia();
            } else {
                goToNextMedia();
            }
        }

        touchStartX = null;
        touchStartY = null;
    };

    prevMediaBtn.addEventListener('click', goToPrevMedia);
    nextMediaBtn.addEventListener('click', goToNextMedia);
    leftMedia.addEventListener('touchstart', handleTouchStart, { passive: true });
    leftMedia.addEventListener('touchend', handleTouchEnd, { passive: true });
>>>>>>> Stashed changes

    function openProductsDetails(productData) {
        activeProduct = productData;
        lastFocus = document.activeElement;

        titleEl.textContent = productData.name;
        descEl.textContent = productData.desc || '';

        const preservedImages = Array.isArray(productData.imageLinks) ? productData.imageLinks.slice(0, 6) : [];
        const preservedVideo = String(productData.videoLink || '').trim();
        mediaItems = preservedImages.slice();
        if (preservedVideo) {
            mediaItems.push(preservedVideo);
        }
        if (!mediaItems.length) {
            mediaItems = [productData.imgSrc || ''];
        }

        activeMediaIndex = 0;
        renderProductMedia();

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
        if (!modalOverlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeProductsDetails();
            return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrevMedia();
            return;
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNextMedia();
            return;
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
                if (!state.cart.length) return;
                openCheckoutModal(state.cart);
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
                    empty.className = 'ecommerce-cart-item ecommerce-cart-empty';
                    empty.textContent = 'Your cart is empty. Add some premium supplements to get started!';
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

                        const quantity = item.quantity || item.qty || 1;
                        const sub = document.createElement('div');
                        sub.className = 'ecommerce-item-sub';
                        sub.textContent = `Qty ${quantity} • ₹${(item.our * quantity).toLocaleString('en-IN')}`;

                        meta.appendChild(name);
                        meta.appendChild(sub);

                        const actions = document.createElement('div');
                        actions.className = 'ecommerce-item-actions';

                        const qtyControls = document.createElement('div');
                        qtyControls.className = 'ecommerce-qty-controls';

                        const minus = document.createElement('button');
                        minus.type = 'button';
                        minus.className = 'ecommerce-qty-btn ecommerce-qty-minus';
                        minus.textContent = '-';
                        minus.addEventListener('click', function () {
                            const idx = state.cart.findIndex((entry) => entry.key === item.key);
                            if (idx >= 0) {
                                state.cart[idx].quantity = Math.max(0, (state.cart[idx].quantity || state.cart[idx].qty || 1) - 1);
                                if (state.cart[idx].quantity < 1) {
                                    state.cart.splice(idx, 1);
                                }
                            }
                            updateHeaderBadges();
                            updateSidebarUI();
                        });

                        const qtyValue = document.createElement('div');
                        qtyValue.className = 'ecommerce-qty-value';
                        qtyValue.textContent = quantity;

                        const plus = document.createElement('button');
                        plus.type = 'button';
                        plus.className = 'ecommerce-qty-btn ecommerce-qty-plus';
                        plus.textContent = '+';
                        plus.addEventListener('click', function () {
                            const idx = state.cart.findIndex((entry) => entry.key === item.key);
                            if (idx >= 0) {
                                state.cart[idx].quantity = (state.cart[idx].quantity || state.cart[idx].qty || 1) + 1;
                            }
                            updateHeaderBadges();
                            updateSidebarUI();
                        });

                        qtyControls.appendChild(minus);
                        qtyControls.appendChild(qtyValue);
                        qtyControls.appendChild(plus);

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
                        actions.appendChild(qtyControls);
                        actions.appendChild(trash);
                        row.appendChild(itemBody);
                        row.appendChild(actions);
                        wrapper.appendChild(row);
                        cartList.appendChild(wrapper);
                    });
                }

                const total = state.cart.reduce((sum, item) => sum + item.our * (item.quantity || 1), 0);
                totalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
                orderBtn.disabled = items.length === 0;
                orderBtn.classList.toggle('disabled', items.length === 0);
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

