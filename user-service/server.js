const express = require("express");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const swaggerDocument = require("./swagger");

require("dotenv").config({ path: path.join(__dirname, ".env") });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms_user_service";

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "route not found" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("[User Service] Connected to MongoDB");
  } catch (error) {
    console.warn("[User Service] MongoDB connection failed. Using local JSON fallback.", error.message);
  }

  app.listen(PORT, () => {
    const mode = mongoose.connection.readyState === 1 ? "mongodb" : "json-fallback";
    console.log(`[User Service] Running on port ${PORT} (${mode})`);
  });
}

startServer();
