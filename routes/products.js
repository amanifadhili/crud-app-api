const express = require('express');
const router = express.Router();
const db = require('../db');
const isAdmin = require('../middleware/role');

// Create product (admin only)
router.post('/', isAdmin, (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  db.query(
    'INSERT INTO products (name, description, price) VALUES (?, ?, ?)', 
    [name, description, price], 
    (err, result) => {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ success: false, message: 'Database error creating product.' });
      }
      res.status(201).json({ success: true, message: 'Product created', id: result.insertId });
    }
  );
});

// Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ success: false, message: 'Database error fetching products.' });
    }
    res.json({ success: true, products: results });
  });
});

// Get a single product by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error fetching product:', err);
        return res.status(500).json({ success: false, message: 'Database error fetching product.' });
      }
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      res.json({ success: true, product: result[0] });
    });
  });
  
// Update product (admin only)
router.put('/:id', isAdmin, (req, res) => {
  const { name, description, price } = req.body;
  const { id } = req.params;

  if (!name || !description || price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required for update.' });
  }

  db.query(
    'UPDATE products SET name=?, description=?, price=? WHERE id=?', 
    [name, description, price, id], 
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ success: false, message: 'Database error updating product.' });
      }
      res.json({ success: true, message: 'Product updated' });
    }
  );
});

// Delete product (admin only)
router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id=?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ success: false, message: 'Database error deleting product.' });
    }
    res.json({ success: true, message: 'Product deleted' });
  });
});

module.exports = router;
