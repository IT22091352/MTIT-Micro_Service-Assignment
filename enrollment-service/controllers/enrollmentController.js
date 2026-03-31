const enrollmentModel = require("../models/enrollmentModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

async function createEnrollment(req, res) {
  try {
    console.log("[Enrollment Service] POST /enrollments called");
    const { userId, courseId } = req.body;

    if (!isValidId(userId) || !isValidId(courseId)) {
      return res.status(400).json({ message: "userId and courseId must be positive integers" });
    }

    const newEnrollment = await enrollmentModel.create({ userId, courseId });
    return res.status(201).json(newEnrollment);
  } catch (error) {
    console.error("[Enrollment Service] createEnrollment error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getEnrollments(req, res) {
  try {
    console.log("[Enrollment Service] GET /enrollments called");
    const enrollments = await enrollmentModel.getAll();
    return res.json(enrollments);
  } catch (error) {
    console.error("[Enrollment Service] getEnrollments error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getEnrollmentById(req, res) {
  try {
    console.log("[Enrollment Service] GET /enrollments/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const enrollment = await enrollmentModel.getById(Number(req.params.id));
    if (!enrollment) {
      return res.status(404).json({ message: "enrollment not found" });
    }

    return res.json(enrollment);
  } catch (error) {
    console.error("[Enrollment Service] getEnrollmentById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateEnrollment(req, res) {
  try {
    console.log("[Enrollment Service] PUT /enrollments/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { userId, courseId } = req.body;
    if (!isValidId(userId) || !isValidId(courseId)) {
      return res.status(400).json({ message: "userId and courseId must be positive integers" });
    }

    const updated = await enrollmentModel.update(Number(req.params.id), { userId, courseId });
    if (!updated) {
      return res.status(404).json({ message: "enrollment not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[Enrollment Service] updateEnrollment error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteEnrollment(req, res) {
  try {
    console.log("[Enrollment Service] DELETE /enrollments/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await enrollmentModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "enrollment not found" });
    }

    return res.json({ message: "enrollment deleted successfully", enrollment: deleted });
  } catch (error) {
    console.error("[Enrollment Service] deleteEnrollment error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment
};
