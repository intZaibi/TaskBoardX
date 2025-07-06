const router = require('express').Router();
const { getCourses, setCourses } = require('../models/dataStore');

router.get('/', (req, res) => {
  res.json(req.db.courses.filter((course)=>course.ownerId === req.user.id));
});

router.get('/:id', (req, res) => {
  const course = getCourses().find(c => c.id == req.params.id);
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json(course);
});

router.post('/', (req, res) => {
  const data = getCourses();
  const newCourse = { ...req.body, id: Date.now(), ownerId: req.user.id };
  data.push(newCourse);
  setCourses(data);
  res.status(201).json(newCourse);
});

router.patch('/:id', (req, res) => {
  const data = getCourses();
  const index = data.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && data[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  data[index] = { ...data[index], ...req.body };
  setCourses(data);
  res.json(data[index]);
});

router.delete('/:id', (req, res) => {
  const data = getCourses();
  const index = data.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && data[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  const deleted = data.splice(index, 1);
  setCourses(data);
  res.json(deleted[0]);
});

module.exports = router;
