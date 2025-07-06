const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const headers = req.headers.authorization || '';
  const token = headers.startsWith('Bearer ') ? headers.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
