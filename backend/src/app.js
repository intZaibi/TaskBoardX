require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const coursesRoute = require('./routes/courses');
const projectsRoute = require('./routes/projects');
const notificationsRoute = require('./routes/notifications');

// Load seed data
const seed = require('../seed-data.json');
const db = {
  userCourses: [...seed.userCourses],
  projects:    [...seed.projects],
  notifications: [...seed.notifications],
};

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  // attach db to request for routes
  req.db = db;
  next();
});
app.use(auth);

app.use('/user', coursesRoute);
app.use('/projects', projectsRoute);
app.use('/notifications', notificationsRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
module.exports = app;