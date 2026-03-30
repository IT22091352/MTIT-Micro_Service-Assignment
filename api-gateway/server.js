const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://localhost:3001/users",
    changeOrigin: true
  })
);

app.use(
  "/api/courses",
  createProxyMiddleware({
    target: "http://localhost:3002/courses",
    changeOrigin: true
  })
);

app.use(
  "/api/enrollments",
  createProxyMiddleware({
    target: "http://localhost:3003/enrollments",
    changeOrigin: true
  })
);

app.use(
  "/api/contents",
  createProxyMiddleware({
    target: "http://localhost:3004/contents",
    changeOrigin: true
  })
);

app.use(
  "/api/progress",
  createProxyMiddleware({
    target: "http://localhost:3005/progress",
    changeOrigin: true
  })
);

app.use(
  "/api/reviews",
  createProxyMiddleware({
    target: "http://localhost:3006/reviews",
    changeOrigin: true
  })
);

app.use(
  "/api/reviews-docs",
  createProxyMiddleware({
    target: "http://localhost:3006/api-docs",
    changeOrigin: true
  })
);

app.use((req, res) => {
  res.status(404).json({ message: "gateway route not found" });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});
