// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // optional, for Thunder Client or Postman
const db = require('./db'); // <--- USE your db.js
const verifyToken = require('./middleware/auth');
const isAdmin = require('./middleware/role');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(express.json());
app.use(cors()); // optional but recommended for APIs

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Using promise-based query
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );
    
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Using promise-based query
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (results.length > 0) {
      const user = results[0];
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.use('/users', verifyToken, userRoutes);
app.use('/products', verifyToken, productRoutes);
app.use('/orders', verifyToken, orderRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
