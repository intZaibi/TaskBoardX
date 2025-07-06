const jwt = require('jsonwebtoken');
const fs = require('fs');
const seedPath = './seed-data.json';
require('dotenv').config();

const login = async (req, res) => {
  const { email } = req.body;
  console.log(req.body)

  // Validate required fields
  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide your email." });
  }
  
  // if db is not accessable 
  if (req.db == undefined) return res.status(500).json({ message: "Something went wrong!" });

  const user = req.db.users?.find((user)=>user.email === email);

  if (!user) return res.status(404).json({ message: "Email not found!" });

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "enc",
    { expiresIn: '1h' }
  );

  const index = req.db.users.findIndex((user)=>user.email===email)
  req.db.users[index].token = token;
  try {
    fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  } catch (error) {
    console.log('db updation failed!')
    return res.status(500).json({ message: "Something went wrong!" });
  }

  // Set token as an HTTP-only cookie
  res.cookie('authToken', token, {
    httpOnly: true, 
    secure: true,
    sameSite: 'None',
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({token});
};



const refresh = async (req, res) => {
  const token = req.cookies && req.cookies.authToken ? req.cookies.authToken : req.headers?.authorization?.startsWith('Bearer ') ? req.headers?.authorization?.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err && err.message.includes('expired')) return res.clearCookie('authToken').status(403).json({ message: 'Token expired!' });
    else if (err) return res.status(403).json({ message: 'Token verification failed' });
    return decoded;
  });
  
  // If db is not accessable 
  if (req.db == undefined) 
    return res.status(500).json({ message: "Something went wrong!" });

  // Fetch user from db
  const dbToken = req.db.users?.find((user)=>user.token === token);
  if (!dbToken) {
    return res.clearCookie('authToken').status(403).json({ message: "Token is not verified!" });
  }

  // Generate JWT
  const newToken = jwt.sign(
    {userId: decoded.userId, role: decoded.role},
    process.env.JWT_SECRET || "enc",
    { expiresIn: '1s' }
  );

  const index = req.db.users.findIndex((user)=>user.token === token)
  req.db.users[index].token = newToken;
  try {
    fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  } catch (error) {
    console.log('db updation failed!')
    return res.status(500).json({ message: "Something went wrong!" });
  }

  // Set token as an HTTP-only cookie
  res.cookie('authToken', newToken, {
    httpOnly: true, 
    secure: true,
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({token: newToken});
};



const logout = (req, res) => {
  const token = req.cookies && req.cookies.authToken ? req.cookies.authToken : req.headers?.authorization?.startsWith('Bearer ') ? req.headers?.authorization?.slice(7) : '';

  if (!token) return res.status(403).json({ error: 'Unauthorized' });

  // If db is not accessable 
  if (req.db == undefined) 
    return res.status(500).json({ message: "Something went wrong!" });

  // Fetch user from db
  const dbToken = req.db.users?.find((user)=>user.token === token);
  if (!dbToken) {
    res.clearCookie('authToken').status(403).json({ message: "Token is not verified!" });
    return
  }
  
  const index = req.db.users.findIndex((user)=>user.token=== token)
  req.db.users[index].token = '';
  try {
    fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  } catch (error) {
    console.log('db updation failed!')
    return res.status(500).json({ message: "Something went wrong!" });
  }

  return res.clearCookie('authToken').status(200).json({message: 'Logged out successfully'});
}

module.exports = {login, refresh, logout}