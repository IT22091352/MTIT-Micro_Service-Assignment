const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const DATA_FILE = path.join(__dirname, "..", "data", "users.json");

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

async function readJsonUsers() {
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

async function writeJsonUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
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
    const users = await readJsonUsers();
    return [...users].sort((a, b) => a.id - b.id);
  }

  return User.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function getById(id) {
  if (!isMongoConnected()) {
    const users = await readJsonUsers();
    return users.find((user) => user.id === id) || null;
  }

  return User.findOne({ id }, { _id: 0 }).lean();
}

async function create(userData) {
  if (!isMongoConnected()) {
    const users = await readJsonUsers();
    const last = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newUser = {
      id: last + 1,
      name: userData.name,
      email: userData.email
    };
    users.push(newUser);
    await writeJsonUsers(users);
    return newUser;
  }

  const last = await User.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
  const newId = last ? last.id + 1 : 1;
  const newUser = await User.create({
    id: newId,
    name: userData.name,
    email: userData.email
  });

  return sanitize(newUser);
}

async function update(id, userData) {
  if (!isMongoConnected()) {
    const users = await readJsonUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      name: userData.name,
      email: userData.email
    };

    await writeJsonUsers(users);
    return users[index];
  }

  const updated = await User.findOneAndUpdate(
    { id },
    { name: userData.name, email: userData.email },
    { new: true, runValidators: true }
  ).lean();

  return sanitize(updated);
}

async function remove(id) {
  if (!isMongoConnected()) {
    const users = await readJsonUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }

    const [deleted] = users.splice(index, 1);
    await writeJsonUsers(users);
    return deleted;
  }

  const deleted = await User.findOneAndDelete({ id }).lean();
  return sanitize(deleted);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
