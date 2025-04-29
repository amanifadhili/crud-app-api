// db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-amanifadhili.alwaysdata.net',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a Promise wrapped instance of the pool
const promisePool = pool.promise();

// Function to initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table if it doesn't exist
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create orders table if it doesn't exist
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        product_id INT(11) NOT NULL,
        quantity INT(11) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    // Check if sample data needs to be inserted
    const [userRows] = await promisePool.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      // Insert sample users
      await promisePool.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ('Admin User', 'admin@gmail.com', '$2b$10$Gu4qICoLS6rXxotoCTWv5uKJuwZ4Z23lcD/DJ8KyXCnj29ihAFZWm', 'admin'),
        ('Regular User', 'user@gmail.com', '$2b$10$Gu4qICoLS6rXxotoCTWv5uKJuwZ4Z23lcD/DJ8KyXCnj29ihAFZWm', 'user')
      `);
      console.log('Sample users inserted');
    }
    
    const [productRows] = await promisePool.query('SELECT COUNT(*) as count FROM products');
    if (productRows[0].count === 0) {
      // Insert sample products
      await promisePool.query(`
        INSERT INTO products (name, description, price) VALUES
        ('Laptop', 'High-performance laptop with 16GB RAM and 512GB SSD', 1299.99),
        ('Smartphone', 'Latest model with 128GB storage and triple camera', 899.99),
        ('Headphones', 'Noise-cancelling wireless headphones', 249.99),
        ('Tablet', '10-inch tablet with 64GB storage', 499.99),
        ('Smartwatch', 'Fitness tracking and notifications', 199.99)
      `);
      console.log('Sample products inserted');
    }
    
    const [orderRows] = await promisePool.query('SELECT COUNT(*) as count FROM orders');
    if (orderRows[0].count === 0) {
      // Insert sample orders
      await promisePool.query(`
        INSERT INTO orders (product_id, quantity, total_price) VALUES
        (1, 2, 2599.98),
        (3, 1, 249.99),
        (2, 3, 2699.97),
        (5, 2, 399.98),
        (4, 1, 499.99)
      `);
      console.log('Sample orders inserted');
    }
    
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
};

// Test the connection and initialize database
const connectAndInitialize = async () => {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('MySQL Connected to alwaysdata...');
    
    // Initialize database tables
    await initializeDatabase();
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

connectAndInitialize();

module.exports = promisePool;
