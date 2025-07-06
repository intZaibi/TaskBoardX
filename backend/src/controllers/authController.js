const jwt = require('jsonwebtoken');
const fs = require('fs');
const seedPath = './seed-data.json';
require('dotenv').config();

const login = async (req, res) => {
  const { email } = req.body;

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
  // If db is not accessable 
  if (req.db == undefined) 
    return res.status(500).json({ message: "Something went wrong!" });

  // Fetch user from db
  const user = req.db.users?.find((user)=> user.token === req.user.token);
  if (!user) {
    return res.clearCookie('authToken').status(401).json({ message: "Unauthorized! Token is not valid!" });
  }

  // Generate JWT
  const newToken = jwt.sign(
    {userId: user.id, role: user.role},
    process.env.JWT_SECRET || "enc",
    { expiresIn: '1h' }
  );

  // updating DB for token
  const index = req.db.users.findIndex((user)=>user.token === req.user.token)
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
  // If db is not accessable 
  if (req.db == undefined) 
    return res.status(500).json({ message: "Something went wrong!" });

  // Fetch user from db
  const user = req.db.users?.find((user)=>user.token === req.user.token);
  if (!user) {
    res.clearCookie('authToken').status(401).json({ message: "Unauthorized! Token is not valid!" });
    return
  }
  
  const index = req.db.users.findIndex((user)=>user.token=== req.user.token)
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