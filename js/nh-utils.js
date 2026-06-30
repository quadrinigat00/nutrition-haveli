/**
 * ============================================
 * NUTRITION HAVELI - Shared Utilities
 * ============================================
 *
 * Small, dependency-free helpers shared by the storefront (index.html / js/main.js)
 * and the owner dashboard (owner.html). Exposed on the global `NH` namespace so
 * both classic (non-module) script contexts can use the same implementations.
 *
 *   - escapeHtml(str)            -> HTML-escaped string
 *   - formatINR(value)           -> "₹1,234" formatted in en-IN
 *   - formatWhatsAppNumber(phone)-> digits-only phone number
 *   - buildWhatsAppLink(phone, message)
 *   - orderWhatsAppLink(message) -> wa.me link to the store number
 *   - openProductsDB()           -> Promise<IDBDatabase> (NutritionHaveliDB)
 *   - getAllProducts(db)         -> Promise<Array> of products
 */
(function (global) {
    'use strict';

    var DB_NAME = 'NutritionHaveliDB';
    var DB_VERSION = 1;
    var STORE_NAME = 'products';
    var WHATSAPP_NUMBER = '919827676474';

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatINR(value) {
        var num = Number(value) || 0;
        return '₹' + num.toLocaleString('en-IN');
    }

    function formatWhatsAppNumber(phone) {
        return String(phone == null ? '' : phone).replace(/\D/g, '');
    }

    function buildWhatsAppLink(phone, message) {
        return 'https://wa.me/' + formatWhatsAppNumber(phone) +
            '?text=' + encodeURIComponent(message == null ? '' : message);
    }

    function orderWhatsAppLink(message) {
        return buildWhatsAppLink(WHATSAPP_NUMBER, message);
    }

    function openProductsDB() {
        return new Promise(function (resolve, reject) {
            try {
                var req = indexedDB.open(DB_NAME, DB_VERSION);
                req.onupgradeneeded = function (e) {
                    var db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                };
                req.onsuccess = function () {
                    resolve(req.result);
                };
                req.onerror = function () {
                    reject(req.error || new Error('Failed to open ' + DB_NAME));
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    function getAllProducts(db) {
        return new Promise(function (resolve, reject) {
            try {
                var tx = db.transaction([STORE_NAME], 'readonly');
                var store = tx.objectStore(STORE_NAME);
                var req = store.getAll();
                req.onsuccess = function () {
                    resolve(Array.isArray(req.result) ? req.result : []);
                };
                req.onerror = function () {
                    reject(req.error || new Error('Failed to fetch products'));
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    global.NH = {
        DB_NAME: DB_NAME,
        DB_VERSION: DB_VERSION,
        STORE_NAME: STORE_NAME,
        WHATSAPP_NUMBER: WHATSAPP_NUMBER,
        escapeHtml: escapeHtml,
        formatINR: formatINR,
        formatWhatsAppNumber: formatWhatsAppNumber,
        buildWhatsAppLink: buildWhatsAppLink,
        orderWhatsAppLink: orderWhatsAppLink,
        openProductsDB: openProductsDB,
        getAllProducts: getAllProducts
    };
})(typeof window !== 'undefined' ? window : this);
