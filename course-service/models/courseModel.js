const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const courseSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { versionKey: false }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
const DATA_FILE = path.join(__dirname, "..", "data", "courses.json");

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

async function readJsonCourses() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeJsonCourses(courses) {
  await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2));
}

function sanitize(doc) {
  if (!doc) {
    return null;
  }

  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain._id;
  return plain;
}

async function getAll() {
  if (!isMongoConnected()) {
    const courses = await readJsonCourses();
    return [...courses].sort((a, b) => a.id - b.id);
  }

  return Course.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  if (!isMongoConnected()) {
    const courses = await readJsonCourses();
    return courses.find((course) => course.id === id) || null;
  }

  return Course.findOne({ id }, { _id: 0 }).lean();
}

async function create(courseData) {
  if (!isMongoConnected()) {
    const courses = await readJsonCourses();
    const last = courses.reduce((max, course) => (course.id > max ? course.id : max), 0);
    const newCourse = {
      id: last + 1,
      title: courseData.title,
      description: courseData.description
    };
    courses.push(newCourse);
    await writeJsonCourses(courses);
    return newCourse;
  }

  const last = await Course.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newCourse = await Course.create({
    id: newId,
    title: courseData.title,
    description: courseData.description
  });

  return sanitize(newCourse);
}

async function update(id, courseData) {
  if (!isMongoConnected()) {
    const courses = await readJsonCourses();
    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) {
      return null;
    }

    courses[index] = {
      ...courses[index],
      title: courseData.title,
      description: courseData.description
    };

    await writeJsonCourses(courses);
    return courses[index];
  }

  const updated = await Course.findOneAndUpdate(
    { id },
    {
      title: courseData.title,
      description: courseData.description
    },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  if (!isMongoConnected()) {
    const courses = await readJsonCourses();
    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) {
      return null;
    }

    const [deleted] = courses.splice(index, 1);
    await writeJsonCourses(courses);
    return deleted;
  }

  const deleted = await Course.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
