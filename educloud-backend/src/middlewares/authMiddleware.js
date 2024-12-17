const { verifyToken } = require('../config/jwt');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to the request
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
