// routes\products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const isAdmin = require('../middleware/role');

// Create product (admin only)
router.post('/', isAdmin, async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)', 
      [name, description, price]
    );
    res.status(201).json({ success: true, message: 'Product created', id: result.insertId });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, message: 'Database error creating product.' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json({ success: true, products: results });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching products.' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      res.json({ success: true, product: result[0] });
    } catch (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ success: false, message: 'Database error fetching product.' });
    }
  });
  
// Update product (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { name, description, price } = req.body;
  const { id } = req.params;

  if (!name || !description || price == null) {
    return res.status(400).json({ success: false, message: 'All fields are required for update.' });
  }

  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=? WHERE id=?', 
      [name, description, price, id]
    );
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, message: 'Database error updating product.' });
  }
});

// Delete product (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ success: false, message: 'Database error deleting product.' });
  }
});

module.exports = router;
