const reviewModel = require("../models/reviewModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

async function createReview(req, res) {
  try {
    console.log("[Review Service] POST /reviews called");
    const { userId, courseId, rating, comment } = req.body;

    if (!isValidId(userId) || !isValidId(courseId) || !isValidRating(rating) || !comment) {
      return res.status(400).json({ message: "userId/courseId must be integers, rating must be 1-5, and comment is required" });
    }

    const newReview = await reviewModel.create({ userId, courseId, rating, comment });
    return res.status(201).json(newReview);
  } catch (error) {
    console.error("[Review Service] createReview error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getReviews(req, res) {
  try {
    console.log("[Review Service] GET /reviews called");
    const reviews = await reviewModel.getAll();
    return res.json(reviews);
  } catch (error) {
    console.error("[Review Service] getReviews error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getReviewById(req, res) {
  try {
    console.log("[Review Service] GET /reviews/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const review = await reviewModel.getById(Number(req.params.id));
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    return res.json(review);
  } catch (error) {
    console.error("[Review Service] getReviewById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateReview(req, res) {
  try {
    console.log("[Review Service] PUT /reviews/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { userId, courseId, rating, comment } = req.body;
    if (!isValidId(userId) || !isValidId(courseId) || !isValidRating(rating) || !comment) {
      return res.status(400).json({ message: "userId/courseId must be integers, rating must be 1-5, and comment is required" });
    }

    const updated = await reviewModel.update(Number(req.params.id), { userId, courseId, rating, comment });
    if (!updated) {
      return res.status(404).json({ message: "review not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[Review Service] updateReview error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteReview(req, res) {
  try {
    console.log("[Review Service] DELETE /reviews/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await reviewModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "review not found" });
    }

    return res.json({ message: "review deleted successfully", review: deleted });
  } catch (error) {
    console.error("[Review Service] deleteReview error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
};
