/**
 * Unit/integration tests for backend/server.js
 *
 * Exercises every API route and the global 404 handler using supertest
 * against the exported Express app (the app does not call listen() when
 * required as a module).
 */
const request = require('supertest');
const app = require('../../backend/server');

describe('GET /api/health', () => {
    it('returns status ok with a message and ISO timestamp', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.message).toMatch(/Nutrition Haveli/i);
        // timestamp should be a valid ISO date string
        expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
    });
});

describe('GET /api/products', () => {
    it('returns the full product catalogue', async () => {
        const res = await request(app).get('/api/products');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(6);
    });

    it('returns products with the expected shape and unique ids', async () => {
        const res = await request(app).get('/api/products');
        const products = res.body;

        const ids = products.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);

        products.forEach((product) => {
            expect(product).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    name_hi: expect.any(String),
                    category: expect.any(String),
                    description: expect.any(String),
                    description_hi: expect.any(String),
                    price: expect.any(String),
                    inStock: expect.any(Boolean)
                })
            );
        });
    });
});

describe('POST /api/inquiry', () => {
    it('accepts an inquiry with all fields', async () => {
        const res = await request(app)
            .post('/api/inquiry')
            .send({
                name: 'Asha',
                phone: '9827676474',
                email: 'asha@example.com',
                product: 'Whey Protein',
                message: 'Is this in stock?'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/thank you/i);
    });

    it('accepts an inquiry when only the required fields are present', async () => {
        const res = await request(app)
            .post('/api/inquiry')
            .send({ name: 'Ravi', phone: '9000000000' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('rejects an inquiry missing the name', async () => {
        const res = await request(app)
            .post('/api/inquiry')
            .send({ phone: '9000000000' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/name and phone/i);
    });

    it('rejects an inquiry missing the phone', async () => {
        const res = await request(app)
            .post('/api/inquiry')
            .send({ name: 'Ravi' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('rejects an empty inquiry body', async () => {
        const res = await request(app).post('/api/inquiry').send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('GET /api/business-info', () => {
    it('returns the business contact details', async () => {
        const res = await request(app).get('/api/business-info');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'Nutrition Haveli',
                phone: expect.any(String),
                whatsapp: expect.any(String),
                address: expect.any(String),
                hours: expect.any(String),
                delivery: expect.any(String),
                orderingMode: expect.any(String)
            })
        );
    });
});

describe('GET / (frontend route)', () => {
    it('serves the index.html document', async () => {
        const res = await request(app).get('/');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.text).toMatch(/<!DOCTYPE html>/i);
    });
});

describe('404 handler', () => {
    it('returns a JSON 404 for unknown API routes', async () => {
        const res = await request(app).get('/api/does-not-exist');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not Found');
        expect(res.body.message).toMatch(/not found/i);
    });
});
