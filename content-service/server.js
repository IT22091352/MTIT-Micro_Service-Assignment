const express = require("express");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const contentRoutes = require("./routes/contentRoutes");
const swaggerDocument = require("./swagger");

require("dotenv").config({ path: path.join(__dirname, ".env") });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = 3004;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms_content_service";

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/contents", contentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "route not found" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("[Content Service] Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`[Content Service] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[Content Service] MongoDB connection failed", error.message);
    process.exit(1);
  }
}

startServer();
