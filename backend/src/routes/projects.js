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
router.patch("/bulk-status", bulkUpdate);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;