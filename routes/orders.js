// routes\orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const isAdmin = require('../middleware/role');

// Create an Order (Admin only)
router.post('/', isAdmin, async (req, res) => {
  const { product_id, quantity, total_price } = req.body;

  if (!product_id || !quantity || total_price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO orders (product_id, quantity, total_price) VALUES (?, ?, ?)', 
      [product_id, quantity, total_price]
    );
    res.status(201).json({ success: true, message: 'Order created', id: result.insertId });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ success: false, message: 'Database error creating order.' });
  }
});

// Get all Orders
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM orders');
    res.json({ success: true, orders: results });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching orders.' });
  }
});
// Get a single order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      res.json({ success: true, order: result[0] });
    } catch (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ success: false, message: 'Database error fetching order.' });
    }
  });
  

// Update an Order (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { product_id, quantity, total_price } = req.body;
  const { id } = req.params;

  if (!product_id || !quantity || total_price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required for update.' });
  }

  try {
    await db.query(
      'UPDATE orders SET product_id=?, quantity=?, total_price=? WHERE id=?', 
      [product_id, quantity, total_price, id]
    );
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ success: false, message: 'Database error updating order.' });
  }
});

// Delete an Order (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM orders WHERE id=?', [id]);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ success: false, message: 'Database error deleting order.' });
  }
});

module.exports = router;
