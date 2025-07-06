const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const headers = req.headers.authorization || '';
  const token = headers.startsWith('Bearer ') ? headers.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  req.token = token  // attached to match it with the token in db
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err && err.message.includes('expired')) 
      return res.clearCookie('authToken').status(403).json({ error: 'Token expired!' });
    else if (err) 
      return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
  }
};
