const fs = require('fs');
const seedPath = './seed-data.json';

const getAllCourses = (req, res) => {
  return req.user.role === 'admin' ?
  res.status(200).json(req.db.courses) :
  res.status(200).json(req.db.courses.filter((course)=>course.ownerId === req.user.id));
}

const getCourseById = (req, res) => {
  const id = Number(req.params.id);
  const course = req.db.courses.find(c => c.id == id);

  if (!course) 
    return res.status(404).json({ error: 'Course not found!' });

  return res.status(200).json(course);
}

const createCourse = (req, res) => {
  const newCourse = { ...req.body, id: (req.db.courses[req.db.courses.length-1].id)+1, ownerId: req.user.id };
  
  req.db.courses.push(newCourse);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.status(201).json(newCourse);
}

const updateCourse = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.courses.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.courses[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  if (req.body.id !== undefined) return res.status(400).json({error: "Course id is immutable"});

  req.db.courses[index] = { ...req.db.courses[index], ...req.body };
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.json(req.db.courses[index]);
}

const deleteCourse = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.courses.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.courses[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  const deleted = req.db.courses.splice(index, 1);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.json(deleted[0]);
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
}