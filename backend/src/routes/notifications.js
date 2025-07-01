const router = require('express').Router();

// GET /notifications
router.get('/', (req, res) => {
  res.json(req.db.notifications);
});

// POST /notifications
router.post('/', (req, res) => {
  const nextId = req.db.notifications.reduce((max, n) => Math.max(max, n.id), 0) + 1;
  const newItem = { id: nextId, createdAt: new Date().toISOString(), ...req.body };
  req.db.notifications.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;