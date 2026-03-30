const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const reviewSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    courseId: { type: Number, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { versionKey: false }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const DATA_FILE = path.join(__dirname, "..", "data", "reviews.json");

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

async function readJsonReviews() {
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

async function writeJsonReviews(reviews) {
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));
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
    const reviews = await readJsonReviews();
    return [...reviews].sort((a, b) => a.id - b.id);
  }

  return Review.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  if (!isMongoConnected()) {
    const reviews = await readJsonReviews();
    return reviews.find((review) => review.id === id) || null;
  }

  return Review.findOne({ id }, { _id: 0 }).lean();
}

async function create(reviewData) {
  if (!isMongoConnected()) {
    const reviews = await readJsonReviews();
    const last = reviews.reduce((max, review) => (review.id > max ? review.id : max), 0);
    const newReview = {
      id: last + 1,
      userId: reviewData.userId,
      courseId: reviewData.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment
    };
    reviews.push(newReview);
    await writeJsonReviews(reviews);
    return newReview;
  }

  const last = await Review.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newReview = await Review.create({
    id: newId,
    userId: reviewData.userId,
    courseId: reviewData.courseId,
    rating: reviewData.rating,
    comment: reviewData.comment
  });

  return sanitize(newReview);
}

async function update(id, reviewData) {
  if (!isMongoConnected()) {
    const reviews = await readJsonReviews();
    const index = reviews.findIndex((review) => review.id === id);
    if (index === -1) {
      return null;
    }

    reviews[index] = {
      ...reviews[index],
      userId: reviewData.userId,
      courseId: reviewData.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment
    };

    await writeJsonReviews(reviews);
    return reviews[index];
  }

  const updated = await Review.findOneAndUpdate(
    { id },
    {
      userId: reviewData.userId,
      courseId: reviewData.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment
    },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  if (!isMongoConnected()) {
    const reviews = await readJsonReviews();
    const index = reviews.findIndex((review) => review.id === id);
    if (index === -1) {
      return null;
    }

    const [deleted] = reviews.splice(index, 1);
    await writeJsonReviews(reviews);
    return deleted;
  }

  const deleted = await Review.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
