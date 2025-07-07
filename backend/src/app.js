require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth.js');
const authRoute = require('./routes/auth.js');
const coursesRoute = require('./routes/courses.js');
const projectsRoute = require('./routes/projects.js');
const notificationsRoute = require('./routes/notifications');

// Load seed data
const seed = require('../seed-data.json');
const db = {
  users: [...seed.users],
  courses: [...seed.courses],
  projects: [...seed.projects],
  notifications: [...seed.notifications],
};

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL, 
  credentials: true, // Allow credentials (cookies)
}));
app.use(express.json());
app.use((req, res, next) => {
  req.db = db; // attach db to request for routes
  next();
});
app.use(auth);

app.use('/courses', coursesRoute);
app.use('/auth', authRoute);
app.use('/projects', projectsRoute );
app.use('/notifications', notificationsRoute);

module.exports = app;

// For local run with Socket.io
if (require.main === module) {
  const http = require('http');
  const { init } = require('./socket/index.js');

  const server = http.createServer(app);
  init(server); // initialize socket server

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`API & WebSocket server running on port ${PORT}`);
  });
}