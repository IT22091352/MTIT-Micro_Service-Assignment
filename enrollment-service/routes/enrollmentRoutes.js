const express = require("express");
const controller = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", controller.createEnrollment);
router.get("/", controller.getEnrollments);
router.get("/:id", controller.getEnrollmentById);
router.put("/:id", controller.updateEnrollment);
router.delete("/:id", controller.deleteEnrollment);

module.exports = router;
