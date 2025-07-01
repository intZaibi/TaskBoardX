const router = require('express').Router();

// PATCH /projects/:id/status
router.patch('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const project = req.db.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  project.status = req.body.status;
  res.json(project);
});

module.exports = router;