const contentModel = require("../models/contentModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

function isValidType(type) {
  return type === "video" || type === "pdf";
}

async function createContent(req, res) {
  try {
    console.log("[Content Service] POST /contents called");
    const { courseId, type, url } = req.body;

    if (!isValidId(courseId) || !isValidType(type) || !url) {
      return res.status(400).json({ message: "courseId must be integer, type must be video/pdf, and url is required" });
    }

    const newContent = await contentModel.create({ courseId, type, url });
    return res.status(201).json(newContent);
  } catch (error) {
    console.error("[Content Service] createContent error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getContents(req, res) {
  try {
    console.log("[Content Service] GET /contents called");
    const contents = await contentModel.getAll();
    return res.json(contents);
  } catch (error) {
    console.error("[Content Service] getContents error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getContentById(req, res) {
  try {
    console.log("[Content Service] GET /contents/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const content = await contentModel.getById(Number(req.params.id));
    if (!content) {
      return res.status(404).json({ message: "content not found" });
    }

    return res.json(content);
  } catch (error) {
    console.error("[Content Service] getContentById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateContent(req, res) {
  try {
    console.log("[Content Service] PUT /contents/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { courseId, type, url } = req.body;
    if (!isValidId(courseId) || !isValidType(type) || !url) {
      return res.status(400).json({ message: "courseId must be integer, type must be video/pdf, and url is required" });
    }

    const updated = await contentModel.update(Number(req.params.id), { courseId, type, url });
    if (!updated) {
      return res.status(404).json({ message: "content not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[Content Service] updateContent error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteContent(req, res) {
  try {
    console.log("[Content Service] DELETE /contents/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await contentModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "content not found" });
    }

    return res.json({ message: "content deleted successfully", content: deleted });
  } catch (error) {
    console.error("[Content Service] deleteContent error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent
};
