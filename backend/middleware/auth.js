const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  console.log('Auth header:', req.headers.authorization);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('Decoded token:', decoded);
    
    // For development with default admin
    if (decoded.id === 'default-admin-id') {
      req.user = {
        id: 'default-admin-id',
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      return next();
    }
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

module.exports = { protect };