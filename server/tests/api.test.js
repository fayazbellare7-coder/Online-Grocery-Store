import request from 'supertest';
import app from '../src/app.js';
import { seedDatabase } from '../src/db/seed.js';
import db from '../src/db/index.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await seedDatabase();
});

afterAll(() => {
  db.close();
});

describe('FreshCart API Test Suite', () => {
  let customerToken;
  let adminToken;
  let customerId;

  describe('1. Health & Discovery', () => {
    it('GET /api/health should return 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('2. Authentication & Roles', () => {
    it('POST /api/auth/login should authenticate customer', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@freshcart.com',
          password: 'User@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('customer');

      customerToken = res.body.token;
      customerId = res.body.user.id;
    });

    it('POST /api/auth/login should authenticate admin', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@freshcart.com',
          password: 'Admin@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('admin');

      adminToken = res.body.token;
    });

    it('POST /api/auth/login should reject bad password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@freshcart.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should return current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('user@freshcart.com');
    });
  });

  describe('3. Categories & Products Browsing', () => {
    it('GET /api/categories should return all categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.categories.length).toBeGreaterThanOrEqual(7);
    });

    it('GET /api/products should support search and category filters', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({ search: 'Banana', category: 'fruits-vegetables' });

      expect(res.status).toBe(200);
      expect(res.body.products.length).toBeGreaterThanOrEqual(1);
      expect(res.body.products[0].name).toContain('Banana');
    });

    it('GET /api/products/:id should return single product with related items', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.product.id).toBe(1);
      expect(res.body.relatedProducts).toBeDefined();
    });
  });

  describe('4. Cart Management & Calculations', () => {
    it('DELETE /api/cart should clear cart first', async () => {
      const res = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(0);
      expect(res.body.summary.subtotal).toBe(0);
    });

    it('POST /api/cart should add items and calculate subtotal/delivery', async () => {
      // Add product 1 (Bananas: $1.99 - 10% = ~$1.79)
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: 1, quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(1);
      expect(res.body.summary.itemCount).toBe(2);
      expect(res.body.summary.deliveryFee).toBe(4.99); // Under $35 threshold
    });

    it('POST /api/cart should respect stock limits', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: 1, quantity: 9999 });

      expect(res.status).toBe(200);
      // Capped at available stock
      expect(res.body.items[0].quantity).toBeLessThanOrEqual(50);
    });
  });

  describe('5. Checkout & Order Lifecycle Flow', () => {
    let testOrderId;
    let availableSlotId;
    let addressId;
    let productInitialStock;

    it('should setup cart and fetch address & delivery slot', async () => {
      // 1. Clear cart and add 2 units of product 2 (Apples)
      await request(app).delete('/api/cart').set('Authorization', `Bearer ${customerToken}`);
      await request(app).post('/api/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: 2, quantity: 2 });

      // Get initial stock
      const prodRes = await request(app).get('/api/products/2');
      productInitialStock = prodRes.body.product.stock;

      // 2. Fetch address
      const addrRes = await request(app).get('/api/addresses').set('Authorization', `Bearer ${customerToken}`);
      addressId = addrRes.body.addresses[0].id;

      // 3. Fetch slot
      const slotRes = await request(app).get('/api/slots');
      const availableSlot = slotRes.body.slots.find((s) => s.isAvailable);
      expect(availableSlot).toBeDefined();
      availableSlotId = availableSlot.id;
    });

    it('POST /api/orders should place order, decrement stock, and clear cart', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          addressId,
          slotId: availableSlotId,
          paymentMethod: 'online',
          paymentSuccess: true
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order).toBeDefined();
      expect(res.body.order.status).toBe('Placed');

      testOrderId = res.body.order.id;

      // Check stock decremented
      const prodRes = await request(app).get('/api/products/2');
      expect(prodRes.body.product.stock).toBe(productInitialStock - 2);

      // Check cart is empty
      const cartRes = await request(app).get('/api/cart').set('Authorization', `Bearer ${customerToken}`);
      expect(cartRes.body.items.length).toBe(0);
    });

    it('GET /api/orders/:id should return order with tracking timeline', async () => {
      const res = await request(app)
        .get(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.order.id).toBe(testOrderId);
      expect(res.body.order.history.length).toBeGreaterThanOrEqual(1);
      expect(res.body.order.history[0].status).toBe('Placed');
    });

    it('PATCH /api/admin/orders/:id/status should update status to Packed & Out for Delivery', async () => {
      const res = await request(app)
        .patch(`/api/admin/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Packed',
          notes: 'Order packed in eco-friendly insulated bags'
        });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('Packed');
    });

    it('PATCH /api/orders/:id/cancel should cancel order and restore stock when eligible', async () => {
      // Create a fresh placed order to test cancellation
      await request(app).post('/api/cart').set('Authorization', `Bearer ${customerToken}`).send({ productId: 3, quantity: 1 });
      const prod3Before = (await request(app).get('/api/products/3')).body.product.stock;

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          addressId,
          slotId: availableSlotId,
          paymentMethod: 'cod'
        });

      const cancelableOrderId = orderRes.body.order.id;

      // Cancel it
      const cancelRes = await request(app)
        .patch(`/api/orders/${cancelableOrderId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'Changed mind' });

      expect(cancelRes.status).toBe(200);

      // Verify stock was restored
      const prod3After = (await request(app).get('/api/products/3')).body.product.stock;
      expect(prod3After).toBe(prod3Before);
    });
  });

  describe('6. Admin Analytics', () => {
    it('GET /api/admin/stats should return business metrics and charts data', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.stats.totalRevenue).toBeGreaterThan(0);
      expect(res.body.stats.ordersByStatus).toBeDefined();
      expect(res.body.stats.last7Days.length).toBe(7);
    });
  });
});
