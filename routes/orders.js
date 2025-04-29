const express = require('express');
const router = express.Router();
const db = require('../db');
const isAdmin = require('../middleware/role');

// Create an Order (Admin only)
router.post('/', isAdmin, (req, res) => {
  const { product_id, quantity, total_price } = req.body;

  if (!product_id || !quantity || total_price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  db.query(
    'INSERT INTO orders (product_id, quantity, total_price) VALUES (?, ?, ?)', 
    [product_id, quantity, total_price], 
    (err, result) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ success: false, message: 'Database error creating order.' });
      }
      res.status(201).json({ success: true, message: 'Order created', id: result.insertId });
    }
  );
});

// Get all Orders
router.get('/', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ success: false, message: 'Database error fetching orders.' });
    }
    res.json({ success: true, orders: results });
  });
});
// Get a single order by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('SELECT * FROM orders WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error fetching order:', err);
        return res.status(500).json({ success: false, message: 'Database error fetching order.' });
      }
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      res.json({ success: true, order: result[0] });
    });
  });
  

// Update an Order (Admin only)
router.put('/:id', isAdmin, (req, res) => {
  const { product_id, quantity, total_price } = req.body;
  const { id } = req.params;

  if (!product_id || !quantity || total_price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required for update.' });
  }

  db.query(
    'UPDATE orders SET product_id=?, quantity=?, total_price=? WHERE id=?', 
    [product_id, quantity, total_price, id], 
    (err) => {
      if (err) {
        console.error('Error updating order:', err);
        return res.status(500).json({ success: false, message: 'Database error updating order.' });
      }
      res.json({ success: true, message: 'Order updated' });
    }
  );
});

// Delete an Order (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM orders WHERE id=?', [id], (err) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ success: false, message: 'Database error deleting order.' });
    }
    res.json({ success: true, message: 'Order deleted' });
  });
});

module.exports = router;
