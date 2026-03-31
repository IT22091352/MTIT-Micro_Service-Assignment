const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    courseId: { type: Number, required: true },
    type: { type: String, required: true, enum: ["video", "pdf"] },
    url: { type: String, required: true }
  },
  { versionKey: false }
);

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);

function sanitize(doc) {
  if (!doc) {
    return null;
  }

  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain._id;
  return plain;
}

async function getAll() {
  return Content.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  return Content.findOne({ id }, { _id: 0 }).lean();
}

async function create(contentData) {
  const last = await Content.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newContent = await Content.create({
    id: newId,
    courseId: contentData.courseId,
    type: contentData.type,
    url: contentData.url
  });

  return sanitize(newContent);
}

async function update(id, contentData) {
  const updated = await Content.findOneAndUpdate(
    { id },
    { courseId: contentData.courseId, type: contentData.type, url: contentData.url },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  const deleted = await Content.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
