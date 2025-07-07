
// // GET /notifications
// router.get('/', (req, res) => {
//   res.json(req.db.notifications);
// });

const seedPath = './seed-data.json';
const fs = require('fs');
const { getIO } = require('../socket/index.js');

const router = require('express').Router();

// POST /notifications
router.post('/', (req, res) => {
  const { message, userId } = req.body;
  if (!message || !userId) return res.status(400).json({ error: 'Missing data' });
  const notes = req.body.notifications;

  const newNote = {
    id: (notes[notes.length-1].id)+1,
    userId,
    from: req.user.id,
    payload: message,
    timestamp: new Date().toISOString()
  };

  notes.push(newNote);
  req.db.notifications.push(notes);

  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');

  // Emit to user's room
  getIO().of('/notify').to(`${userId}`).emit('notification', newNote);

  res.status(201).json(newNote);
});

module.exports = router;
