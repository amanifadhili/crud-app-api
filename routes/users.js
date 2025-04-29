// routes\users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    res.json({ success: true, users: results });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Database error fetching users.' });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: result[0] });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Database error fetching user.' });
  }
});

// POST new user
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ success: true, id: result.insertId, name, email });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Database error creating user.' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required for update.' });
  }

  try {
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Database error updating user.' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Database error deleting user.' });
  }
});

module.exports = router;
