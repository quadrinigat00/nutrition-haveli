/**
 * file. ============================================
 * NUTRITION HAVELI - Backend Server
 * ============================================
 * 
 * A Node.js Express server for handling:
 * - API routes for products and inquiries
 * - Static file serving
 * - Contact form submissions
 * 
 * Author: Nutrition Haveli
 * Date: 2024
 */

// ============================================
// REQUIRE STATEMENTS
// ============================================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// ============================================
// EXPRESS APP SETUP
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Do not advertise the framework in responses
app.disable('x-powered-by');

// CORS - Restrict cross-origin requests to an explicit allowlist.
// Configure via the CORS_ORIGINS env var (comma-separated origins).
// When unset, only same-origin requests (no Origin header) are allowed.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin / non-browser requests (no Origin header).
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    }
}));

// Body parser - Parse JSON request bodies (with a size limit to mitigate abuse)
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Static files - Serve frontend files
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Nutrition Haveli API is running',
        timestamp: new Date().toISOString()
    });
});

// Get products (for future dynamic product management)
app.get('/api/products', (req, res) => {
    // Sample products data - can be replaced with database
    const products = [
        {
            id: 1,
            name: 'Protein Supplements',
            name_hi: 'प्रोटीन सप्लीमेंट',
            category: 'protein',
            description: 'Whey Protein, Casein, Plant Protein - Build muscle & recover faster',
            description_hi: 'व्हे प्रोटीन, केसीन, प्लांट प्रोटीन - मांसपेशियां बनाएं और जल्दी ठीक हों',
            price: '₹1,500 - ₹5,000',
            inStock: true
        },
        {
            id: 2,
            name: 'Creatine',
            name_hi: 'क्रिएटिन',
            category: 'creatine',
            description: 'Monohydrate, HCL, Ethyl Ester - Boost strength & power',
            description_hi: 'मोनोहाइड्रेट, HCL, एथिल एस्टर - ताकत और पावर बढ़ाएं',
            price: '₹500 - ₹2,000',
            inStock: true
        },
        {
            id: 3,
            name: 'Mass Gainers',
            name_hi: 'मास गेनर्स',
            category: 'mass-gainer',
            description: 'High calorie formulas for muscle mass gain',
            description_hi: 'मांसपेशियों को बढ़ाने के लिए हाई कैलोरी फॉर्मूला',
            price: '₹1,800 - ₹4,500',
            inStock: true
        },
        {
            id: 4,
            name: 'Pre-Workout',
            name_hi: 'प्री-वर्कआउट',
            category: 'pre-workout',
            description: 'Energy & focus boosters for intense workouts',
            description_hi: 'तीव्र वर्कआउट के लिए एनर्जी और फोकस बूस्टर',
            price: '₹800 - ₹2,500',
            inStock: true
        },
        {
            id: 5,
            name: 'Fat Burners',
            name_hi: 'फैट बर्नर्स',
            category: 'fat-burner',
            description: 'Thermogenic supplements for weight management',
            description_hi: 'वजन प्रबंधन के लिए थर्मोजेनिक सप्लीमेंट',
            price: '₹600 - ₹2,000',
            inStock: true
        },
        {
            id: 6,
            name: 'Multivitamins',
            name_hi: 'मल्टीविटामिन',
            category: 'multivitamin',
            description: 'Essential vitamins & minerals for overall health',
            description_hi: 'समग्र स्वास्थ्य के लिए आवश्यक विटामिन और खनिज',
            price: '₹300 - ₹1,500',
            inStock: true
        }
    ];
    
    res.json(products);
});

// Basic in-memory rate limiter for the inquiry endpoint to mitigate spam/abuse.
const INQUIRY_WINDOW_MS = 60 * 1000;
const INQUIRY_MAX_PER_WINDOW = 5;
const inquiryHits = new Map();

function inquiryRateLimit(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = inquiryHits.get(ip);

    if (!entry || now - entry.start > INQUIRY_WINDOW_MS) {
        inquiryHits.set(ip, { start: now, count: 1 });
        return next();
    }

    if (entry.count >= INQUIRY_MAX_PER_WINDOW) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.'
        });
    }

    entry.count += 1;
    next();
}

// Coerce a value to a trimmed string and cap its length to avoid oversized input.
function sanitizeField(value, maxLength) {
    if (typeof value !== 'string') return '';
    // Strip control characters (incl. CR/LF) to prevent log injection.
    return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

// Submit inquiry form
app.post('/api/inquiry', inquiryRateLimit, (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};

    const name = sanitizeField(body.name, 100);
    const phone = sanitizeField(body.phone, 20);
    const email = sanitizeField(body.email, 254);
    const product = sanitizeField(body.product, 100);
    const message = sanitizeField(body.message, 1000);

    // Validate required fields
    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Name and phone number are required'
        });
    }

    if (!PHONE_RE.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid phone number'
        });
    }

    if (email && !EMAIL_RE.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    // In a production environment, you would:
    // 1. Save to database
    // 2. Send notification email to business owner
    // 3. Send confirmation SMS/WhatsApp to customer

    // For now, log only non-sensitive metadata (avoid logging customer PII).
    console.log('New inquiry received at', new Date().toISOString(), '| product:', product || 'General');

    res.json({
        success: true,
        message: 'Thank you for your inquiry! We will contact you soon.'
    });
});

// Get business information
app.get('/api/business-info', (req, res) => {
    res.json({
        name: 'Nutrition Haveli',
        address: 'Purana Bazar, Bhadrak, Odisha',
        phone: '+91 9827676474',
        whatsapp: '+91 9827676474',
        hours: '24×7 Available',
        delivery: 'All India Home Delivery',
        orderingMode: 'WhatsApp Order Only'
    });
});

// ============================================
// FRONTEND ROUTES
// ============================================

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============================================
// 404 ERROR HANDLER
// ============================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    if (err && err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Origin not allowed'
        });
    }
    console.error('Error:', err && err.message ? err.message : err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again later.'
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🍏 NUTRITION HAVELI SERVER                     ║
║   =============================================   ║
║                                                   ║
║   Server running at: http://localhost:${PORT}       ║
║   API endpoints:                                  ║
║   - GET  /api/health                              ║
║   - GET  /api/products                            ║
║   - POST /api/inquiry                             ║
║   - GET  /api/business-info                       ║
║                                                   ║
║   Press Ctrl+C to stop the server                 ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

// ============================================
// EXPORT APP FOR TESTING
// ============================================
module.exports = app;
