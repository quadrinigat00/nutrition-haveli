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

// CORS - Allow cross-origin requests
app.use(cors());

// Body parser - Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Submit inquiry form
app.post('/api/inquiry', (req, res) => {
    const { name, phone, email, product, message } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Name and phone number are required'
        });
    }
    
    // In a production environment, you would:
    // 1. Save to database
    // 2. Send notification email to business owner
    // 3. Send confirmation SMS/WhatsApp to customer
    
    // For now, we'll log the inquiry and return success
    console.log('New Inquiry Received:');
    console.log({
        name,
        phone,
        email: email || 'Not provided',
        product: product || 'General',
        message: message || 'No message',
        timestamp: new Date().toISOString()
    });
    
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
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again later.'
    });
});

// ============================================
// START SERVER
// ============================================
if (require.main === module) {
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
}

// ============================================
// EXPORT APP FOR TESTING
// ============================================
module.exports = app;
