const express = require("express");
const controller = require("../controllers/contentController");

const router = express.Router();

router.post("/", controller.createContent);
router.get("/", controller.getContents);
router.get("/:id", controller.getContentById);
router.put("/:id", controller.updateContent);
router.delete("/:id", controller.deleteContent);

module.exports = router;
