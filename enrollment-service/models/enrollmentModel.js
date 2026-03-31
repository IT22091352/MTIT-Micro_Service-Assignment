const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    courseId: { type: Number, required: true }
  },
  { versionKey: false }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

function sanitize(doc) {
  if (!doc) {
    return null;
  }

  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain._id;
  return plain;
}

async function getAll() {
  return Enrollment.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  return Enrollment.findOne({ id }, { _id: 0 }).lean();
}

async function create(enrollmentData) {
  const last = await Enrollment.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newEnrollment = await Enrollment.create({
    id: newId,
    userId: enrollmentData.userId,
    courseId: enrollmentData.courseId
  });

  return sanitize(newEnrollment);
}

async function update(id, enrollmentData) {
  const updated = await Enrollment.findOneAndUpdate(
    { id },
    { userId: enrollmentData.userId, courseId: enrollmentData.courseId },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  const deleted = await Enrollment.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
