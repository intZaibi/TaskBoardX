const router = require('express').Router();

// GET /user/courses
router.get('/courses', (req, res) => {
  res.json(req.db.userCourses);
});

module.exports = router;