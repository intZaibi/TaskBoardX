const router = require("express").Router();
const {
  deleteCourse,
  updateCourse,
  createCourse,
  getCourseById,
  getAllCourses,
} = require("../controllers/courseController");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
