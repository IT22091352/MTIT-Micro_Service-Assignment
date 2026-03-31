const express = require("express");
const controller = require("../controllers/progressController");

const router = express.Router();

router.post("/", controller.createProgress);
router.get("/", controller.getProgress);
router.get("/:id", controller.getProgressById);
router.put("/:id", controller.updateProgress);
router.delete("/:id", controller.deleteProgress);

module.exports = router;
