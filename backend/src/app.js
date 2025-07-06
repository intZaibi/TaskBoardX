require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
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
  // attach db to request for routes
  req.db = db;
  next();
});
app.use(auth);

app.use('/courses', coursesRoute);
app.use('/auth', authRoute);
app.use('/projects', projectsRoute);
app.use('/notifications', notificationsRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
module.exports = app;