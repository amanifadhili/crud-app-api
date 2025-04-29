// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { // Set both id and role
      id: decoded.id,
      role: decoded.role
    };

    next();
  });
};

module.exports = verifyToken;
