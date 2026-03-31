const progressModel = require("../models/progressModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

function isValidPercentage(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

async function createProgress(req, res) {
  try {
    console.log("[Progress Service] POST /progress called");
    const { userId, courseId, completionPercentage } = req.body;

    if (!isValidId(userId) || !isValidId(courseId) || !isValidPercentage(completionPercentage)) {
      return res.status(400).json({ message: "userId/courseId must be integers and completionPercentage must be between 0 and 100" });
    }

    const newProgress = await progressModel.create({ userId, courseId, completionPercentage });
    return res.status(201).json(newProgress);
  } catch (error) {
    console.error("[Progress Service] createProgress error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getProgress(req, res) {
  try {
    console.log("[Progress Service] GET /progress called");
    const progress = await progressModel.getAll();
    return res.json(progress);
  } catch (error) {
    console.error("[Progress Service] getProgress error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getProgressById(req, res) {
  try {
    console.log("[Progress Service] GET /progress/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const progress = await progressModel.getById(Number(req.params.id));
    if (!progress) {
      return res.status(404).json({ message: "progress not found" });
    }

    return res.json(progress);
  } catch (error) {
    console.error("[Progress Service] getProgressById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateProgress(req, res) {
  try {
    console.log("[Progress Service] PUT /progress/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { userId, courseId, completionPercentage } = req.body;
    if (!isValidId(userId) || !isValidId(courseId) || !isValidPercentage(completionPercentage)) {
      return res.status(400).json({ message: "userId/courseId must be integers and completionPercentage must be between 0 and 100" });
    }

    const updated = await progressModel.update(Number(req.params.id), { userId, courseId, completionPercentage });
    if (!updated) {
      return res.status(404).json({ message: "progress not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[Progress Service] updateProgress error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteProgress(req, res) {
  try {
    console.log("[Progress Service] DELETE /progress/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await progressModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "progress not found" });
    }

    return res.json({ message: "progress deleted successfully", progress: deleted });
  } catch (error) {
    console.error("[Progress Service] deleteProgress error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress
};
