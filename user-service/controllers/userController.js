const userModel = require("../models/userModel");

function isValidId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0;
}

async function createUser(req, res) {
  try {
    console.log("[User Service] POST /users called");
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const newUser = await userModel.create({ name, email });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("[User Service] createUser error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getUsers(req, res) {
  try {
    console.log("[User Service] GET /users called");
    const users = await userModel.getAll();
    return res.json(users);
  } catch (error) {
    console.error("[User Service] getUsers error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getUserById(req, res) {
  try {
    console.log("[User Service] GET /users/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const user = await userModel.getById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("[User Service] getUserById error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    console.log("[User Service] PUT /users/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const updated = await userModel.update(Number(req.params.id), { name, email });
    if (!updated) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("[User Service] updateUser error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    console.log("[User Service] DELETE /users/:id called");

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "invalid ID" });
    }

    const deleted = await userModel.remove(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.json({ message: "user deleted successfully", user: deleted });
  } catch (error) {
    console.error("[User Service] deleteUser error", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
