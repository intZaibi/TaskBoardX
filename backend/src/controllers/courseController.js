const fs = require('fs');
const seedPath = './seed-data.json';
const { generateKey, getCache, setCache } = require('../utils/cache');
const { clearCache } = require('../utils/cache');

// const getAllCourses = (req, res) => res.status(200).json(req.db.courses);


const getAllCourses = (req, res) => {
  const key = generateKey(req);
  const cached = getCache(key);
  if (cached) {
    return res.status(200).json(cached);
  }

  let data = [...req.db.courses];

  // Search
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    data = data.filter(c => c.title.toLowerCase().includes(q));
  }

  // Filter by ownerId
  if (req.query.ownerId) {
    data = data.filter(c => c.ownerId == req.query.ownerId);
  }

  // Sort
  const sortBy = req.query.sortBy || 'title';
  const order = req.query.order === 'desc' ? -1 : 1;
  data.sort((a, b) => {
    const valA = (a[sortBy] || '').toString().toLowerCase();
    const valB = (b[sortBy] || '').toString().toLowerCase();
    return valA > valB ? order : valA < valB ? -order : 0;
  });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || data.length;
  const start = (page - 1) * limit;
  const paged = data.slice(start, start + limit);

  setCache(key, paged);
  res.status(200).json(paged);
};


const getCourseById = (req, res) => {
  const id = Number(req.params.id);
  const course = req.db.courses.find(c => c.id == id);

  if (!course) 
    return res.status(404).json({ error: 'Course not found!' });

  return res.status(200).json(course);
}

const createCourse = (req, res) => {
  const {title, progress} = req.body
  const newCourse = { id: (req.db.courses[req.db.courses.length-1].id)+1, title: title || '', progress: isNaN(Number(progress)) ? 0 : Number(progress), ownerId: req.user.id };
  
  req.db.courses.push(newCourse);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  clearCache();

  return res.status(201).json(newCourse);
}

const updateCourse = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.courses.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role != 'admin' && req.db.courses[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  if (req.body.id != undefined) return res.status(400).json({error: "Course id is immutable"});

  const { title, progress } = req.body;
  // Create an object with the fields to update
  const updateFields = {};

  if (title) updateFields.title = title;
  if (!isNaN(Number(progress))) updateFields.progress = progress;

  // If there are fields to update, apply them
  if (Object.keys(updateFields).length > 0)
    req.db.courses[index] = { ...req.db.courses[index], ...updateFields };
  else
    return res.status(400).json({ error: 'Invalid data!' });

  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  clearCache();

  return res.json(req.db.courses[index]);
}

const deleteCourse = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.courses.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role != 'admin' && req.db.courses[index].ownerId != req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this course.' });

  const deleted = req.db.courses.splice(index, 1);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  clearCache();

  return res.json(deleted[0]);
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
}