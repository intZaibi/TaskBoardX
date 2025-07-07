const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const headers = req.headers.authorization || '';
  const token = headers.startsWith('Bearer ') ? headers.slice(7) : null;

  req.token = token;  // attached to be used in routesControllers
  
  if (req.path === '/auth/login' || req.path === '/auth/refresh') return next(); // Bypass auth if requested to login or refresh route
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const user = req.db.users?.find((user)=>user.token == token);
    if (user) req.user = user;
    else throw new Error("Token not found in db!");
    next();
  } catch (err) {
    if (err && err.message.includes('expired')) 
      return res.clearCookie('authToken').status(403).json({ error: 'Token expired!' });
    else 
      console.log(err)
      return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
  }
};
