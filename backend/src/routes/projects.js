const router = require("express").Router();
const {
  deleteProject,
  updateProject,
  createProject,
  getProjectById,
  getAllProjects,
  bulkUpdate,
} = require("../controllers/projectController");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);
router.put("/bulk-status", bulkUpdate);

module.exports = router;