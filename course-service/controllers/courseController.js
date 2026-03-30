const courseModel = require("../models/courseModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

async function createCourse(req, res) {
  try {
    console.log("[Course Service] POST /courses called");
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const newCourse = await courseModel.create({ title, description });
    return res.status(201).json(newCourse);
  } catch (error) {
    console.error("[Course Service] createCourse error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getCourses(req, res) {
  try {
    console.log("[Course Service] GET /courses called");
    const courses = await courseModel.getAll();
    return res.json(courses);
  } catch (error) {
    console.error("[Course Service] getCourses error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getCourseById(req, res) {
  try {
    console.log("[Course Service] GET /courses/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const course = await courseModel.getById(Number(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }

    return res.json(course);
  } catch (error) {
    console.error("[Course Service] getCourseById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateCourse(req, res) {
  try {
    console.log("[Course Service] PUT /courses/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const updated = await courseModel.update(Number(req.params.id), { title, description });
    if (!updated) {
      return res.status(404).json({ message: "course not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[Course Service] updateCourse error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteCourse(req, res) {
  try {
    console.log("[Course Service] DELETE /courses/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await courseModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "course not found" });
    }

    return res.json({ message: "course deleted successfully", course: deleted });
  } catch (error) {
    console.error("[Course Service] deleteCourse error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};
