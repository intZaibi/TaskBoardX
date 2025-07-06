const fs = require('fs');
const seedPath = './seed-data.json';

const getAllProjects = (req, res) => res.status(200).json(req.db.projects) 

const getProjectById = (req, res) => {
  const id = Number(req.params.id);
  const project = req.db.projects.find(project => project.id == id);

  if (!project) 
    return res.status(404).json({ error: 'Project not found!' });

  return res.status(200).json(project);
}

const createProject = (req, res) => {
  const newProject = { ...req.body, id: (req.db.projects[req.db.projects.length-1].id)+1, ownerId: req.user.id };
  
  req.db.projects.push(newProject);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.status(201).json(newProject);
}

const updateProject = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.projects.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.projects[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this project.' });

  if (req.body.id !== undefined || req.body.ownerId !== undefined) return res.status(400).json({error: "Project id and ownerId are immutable"});

  req.db.projects[index] = { ...req.db.projects[index], ...req.body };
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.json(req.db.projects[index]);
}

const deleteProject = (req, res) => {
  const id = Number(req.params.id);
  const index = req.db.projects.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'admin' && req.db.projects[index].ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden! You do not have access to this project.' });

  const deleted = req.db.projects.splice(index, 1);
  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');
  
  return res.json(deleted[0]);
}

const bulkUpdate = (req, res) => {

  let { ids, status } = req.body;

  if (!status || typeof status !== 'string') 
    return res.status(400).json({error: "Invalid status!"})

  status = status.toLowerCase();
  // Prevent immutable fields from being updated
  if (!(status === 'pending' || status === 'in-progress' || status === 'done')) {
    return res.status(400).json({ error: "Invalid status!" });
  }

  if (!Array.isArray(ids) || ids.length === 0) {  // validating ids if it is array and has length > 0 or not
    return res.status(400).json({ error: "Request must include an array of project IDs." });
  }

  const updatedProjects = [];
  const skippedProjects = [];

  for (const id of ids) {
    const projectIndex = req.db.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      skippedProjects.push({ id, reason: 'Not found' });
      continue;
    }

    const project = req.db.projects[projectIndex];

    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
      skippedProjects.push({ id, reason: 'Forbidden' });
      continue;
    }

    // Update the project
    req.db.projects[projectIndex] = { ...project, status };
    updatedProjects.push(req.db.projects[projectIndex]);
  }

  fs.writeFileSync(seedPath, JSON.stringify(req.db, null, 2), 'utf-8');

  return res.status(200).json({
    updated: updatedProjects,
    skipped: skippedProjects
  });

}


module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  bulkUpdate
}