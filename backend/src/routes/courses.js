const router = require('express').Router();
const fs = require('fs');
const seedPath = './seed-data.json';

router.get('/', (req, res) => {
  req.user.role === 'admin' ?
  res.status(200).json(req.db.courses) :
  res.status(200).json(req.db.courses.filter((course)=>course.ownerId === req.user.id));
});

router.get('/:id', (req, res) => {
  const course = req.db.courses.find(c => c.id == req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found!' });
  res.status(200).json(course);
});

router.post('/', (req, res) => {
  const newCourse = { id: (req.db.courses[req.db.courses.length-1].id)+1, ...req.body, ownerId: req.user.id };
  req.db.courses.push(newCourse);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  res.status(201).json(newCourse);
});

router.patch('/:id', (req, res) => {
  const index = req.db.courses.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.courses[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  if (req.body.id !== undefined) return res.status(403).json({error: "Course id is immutable"});

  req.db.courses[index] = { ...req.db.courses[index], ...req.body };
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  res.json(req.db.courses[index]);
});

router.delete('/:id', (req, res) => {
  const index = req.db.courses.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.courses[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  const deleted = req.db.courses.splice(index, 1);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  res.json(deleted[0]);
});

module.exports = router;
