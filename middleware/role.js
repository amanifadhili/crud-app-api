// middleware/role.js
function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden. Admins only.' });
    }
    next();
  }
  
  module.exports = isAdmin;
  