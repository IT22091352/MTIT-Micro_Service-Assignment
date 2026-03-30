const express = require("express");
const controller = require("../controllers/reviewController");

const router = express.Router();

router.post("/", controller.createReview);
router.get("/", controller.getReviews);
router.get("/:id", controller.getReviewById);
router.put("/:id", controller.updateReview);
router.delete("/:id", controller.deleteReview);

module.exports = router;
