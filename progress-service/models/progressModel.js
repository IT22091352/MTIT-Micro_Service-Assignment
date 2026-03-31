const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    courseId: { type: Number, required: true },
    completionPercentage: { type: Number, required: true, min: 0, max: 100 }
  },
  { versionKey: false }
);

const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema);

function sanitize(doc) {
  if (!doc) {
    return null;
  }

  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain._id;
  return plain;
}

async function getAll() {
  return Progress.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  return Progress.findOne({ id }, { _id: 0 }).lean();
}

async function create(progressData) {
  const last = await Progress.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newProgress = await Progress.create({
    id: newId,
    userId: progressData.userId,
    courseId: progressData.courseId,
    completionPercentage: progressData.completionPercentage
  });

  return sanitize(newProgress);
}

async function update(id, progressData) {
  const updated = await Progress.findOneAndUpdate(
    { id },
    {
      userId: progressData.userId,
      courseId: progressData.courseId,
      completionPercentage: progressData.completionPercentage
    },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  const deleted = await Progress.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
