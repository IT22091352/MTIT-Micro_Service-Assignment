# IT4020 LMS Microservices Project (Node.js + Express)

This repository is for your **IT4020 (Modern Topics in IT)** university assignment.

## 🚀 Quick Start

**New to this project?** Follow the [**SETUP.md**](SETUP.md) guide for complete step-by-step setup instructions:

```bash
# 1. Clone and install
git clone <repo-url>
cd MTIT-Group-Assignment
npm install

# 2. Configure MongoDB (see SETUP.md for details)
# Create .env file in root and service folders

# 3. Start all services
npm start

# 4. Access API Gateway
# http://localhost:3000/api-docs
```

**Problems?** Check the [Troubleshooting section in SETUP.md](SETUP.md#step-7-troubleshooting)

---

## Current Status

Full implementation is now included:
- 6 independent microservices
- API Gateway with proxy routing
- MongoDB-based storage using Mongoose
- Swagger docs for each microservice
- Logging and basic error handling
- Automatic port cleanup on startup (prevents conflicts)

## MongoDB Configuration

Each microservice connects to MongoDB:

- **Local MongoDB** (development):
  - Default URIs already configured in `server.js` files
  - Example: `mongodb://127.0.0.1:27017/lms_user_service`

- **MongoDB Atlas** (cloud/production recommended):
  - Create `.env` in root and each service folder
  - Set: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms_service`
  - See [SETUP.md](SETUP.md) for detailed MongoDB Atlas setup

---

## 1) What Is Microservices Architecture?

Microservices architecture is a way to build a system as a collection of **small, independent services**.

Each service:
- handles one specific business area
- runs on its own port/process
- can be developed and tested independently
- communicates over HTTP APIs

In this project, each LMS domain area is a separate microservice:
- User
- Course
- Enrollment
- Content
- Progress
- Review

---

## 2) Why API Gateway Is Important

An API Gateway is a **single entry point** for clients (frontend/mobile/Postman).

Instead of calling 6 different ports directly, the client calls one gateway port (`3000`), and the gateway forwards requests to the correct service.

Benefits:
- simpler client integration
- centralized routing logic
- easier logging and request management
- can add auth/rate-limits later in one place

---

## 3) How Routing Works in This Project

Client request flow:
1. Client sends request to API Gateway on port `3000`.
2. Gateway checks path prefix.
3. Gateway proxies the request to matching microservice.
4. Microservice processes CRUD logic and returns response.
5. Gateway returns response back to client.

Routing map:
- `/api/users` -> User Service (`3001`)
- `/api/courses` -> Course Service (`3002`)
- `/api/enrollments` -> Enrollment Service (`3003`)
- `/api/contents` -> Content Service (`3004`)
- `/api/progress` -> Progress Service (`3005`)
- `/api/reviews` -> Review Service (`3006`)

---

## 4) Required Project Structure

Create this folder structure:

```text
project-root/
|-- api-gateway/
|   |-- package.json
|   `-- server.js
|-- user-service/
|   |-- package.json
|   |-- server.js
|   |-- routes/
|   |   `-- userRoutes.js
|   |-- controllers/
|   |   `-- userController.js
|   |-- models/
|   |   `-- userModel.js
|   |-- data/
|   |   `-- users.json
|   `-- swagger.js
|-- course-service/
|   |-- package.json
|   |-- server.js
|   |-- routes/
|   |   `-- courseRoutes.js
|   |-- controllers/
|   |   `-- courseController.js
|   |-- models/
|   |   `-- courseModel.js
|   |-- data/
|   |   `-- courses.json
|   `-- swagger.js
|-- enrollment-service/
|   |-- package.json
|   |-- server.js
|   |-- routes/
|   |   `-- enrollmentRoutes.js
|   |-- controllers/
|   |   `-- enrollmentController.js
|   |-- models/
|   |   `-- enrollmentModel.js
|   |-- data/
|   |   `-- enrollments.json
|   `-- swagger.js
|-- content-service/
|   |-- package.json
|   |-- server.js
|   |-- routes/
|   |   `-- contentRoutes.js
|   |-- controllers/
|   |   `-- contentController.js
|   |-- models/
|   |   `-- contentModel.js
|   |-- data/
|   |   `-- contents.json
|   `-- swagger.js
|-- progress-service/
|   |-- package.json
|   |-- server.js
|   |-- routes/
|   |   `-- progressRoutes.js
|   |-- controllers/
|   |   `-- progressController.js
|   |-- models/
|   |   `-- progressModel.js
|   |-- data/
|   |   `-- progress.json
|   `-- swagger.js
`-- review-service/
    |-- package.json
    |-- server.js
    |-- routes/
    |   `-- reviewRoutes.js
    |-- controllers/
    |   `-- reviewController.js
    |-- models/
    |   `-- reviewModel.js
    |-- data/
    |   `-- reviews.json
    `-- swagger.js
```

---

## 5) Microservices and Endpoints

Each service must support full CRUD with basic error handling (`404`, invalid ID).

## User Service (Port 3001)
Entity: `User`
Fields: `id`, `name`, `email`
Endpoints:
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

## Course Service (Port 3002)
Entity: `Course`
Fields: `id`, `title`, `description`
Endpoints:
- `POST /courses`
- `GET /courses`
- `GET /courses/:id`
- `PUT /courses/:id`
- `DELETE /courses/:id`

## Enrollment Service (Port 3003)
Entity: `Enrollment`
Fields: `id`, `userId`, `courseId`
Endpoints:
- `POST /enrollments`
- `GET /enrollments`
- `GET /enrollments/:id`
- `PUT /enrollments/:id`
- `DELETE /enrollments/:id`

## Content Service (Port 3004)
Entity: `Content`
Fields: `id`, `courseId`, `type` (`video` or `pdf`), `url`
Endpoints:
- `POST /contents`
- `GET /contents`
- `GET /contents/:id`
- `PUT /contents/:id`
- `DELETE /contents/:id`

## Progress Service (Port 3005)
Entity: `Progress`
Fields: `id`, `userId`, `courseId`, `completionPercentage`
Endpoints:
- `POST /progress`
- `GET /progress`
- `GET /progress/:id`
- `PUT /progress/:id`
- `DELETE /progress/:id`

## Review Service (Port 3006)
Entity: `Review`
Fields: `id`, `userId`, `courseId`, `rating`, `comment`
Endpoints:
- `POST /reviews`
- `GET /reviews`
- `GET /reviews/:id`
- `PUT /reviews/:id`
- `DELETE /reviews/:id`

---

## 6) API Gateway (Port 3000)

Use:
- `express`
- `http-proxy-middleware`

Gateway route mapping:
- `/api/users` -> `http://localhost:3001/users`
- `/api/courses` -> `http://localhost:3002/courses`
- `/api/enrollments` -> `http://localhost:3003/enrollments`
- `/api/contents` -> `http://localhost:3004/contents`
- `/api/progress` -> `http://localhost:3005/progress`
- `/api/reviews` -> `http://localhost:3006/reviews`

---

## 7) Swagger Requirement

Each microservice must include Swagger docs using:
- `swagger-ui-express`

Suggested docs endpoint per service:
- `http://localhost:3001/api-docs`
- `http://localhost:3002/api-docs`
- `http://localhost:3003/api-docs`
- `http://localhost:3004/api-docs`
- `http://localhost:3005/api-docs`
- `http://localhost:3006/api-docs`

For this current workspace (review service only), use:
- `http://localhost:3006/api-docs` (direct service docs)
- `http://localhost:3000/api/reviews-docs` (same docs via API Gateway)

---

## 8) Sample JSON Data (Initial)

Use JSON files for storage in each service's `data` folder.

### users.json
```json
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" }
]
```

### courses.json
```json
[
  { "id": 1, "title": "Node.js Basics", "description": "Intro to Node.js" },
  { "id": 2, "title": "Express API", "description": "REST API with Express" }
]
```

### enrollments.json
```json
[
  { "id": 1, "userId": 1, "courseId": 1 },
  { "id": 2, "userId": 2, "courseId": 2 }
]
```

### contents.json
```json
[
  { "id": 1, "courseId": 1, "type": "video", "url": "https://example.com/video1" },
  { "id": 2, "courseId": 2, "type": "pdf", "url": "https://example.com/doc1.pdf" }
]
```

### progress.json
```json
[
  { "id": 1, "userId": 1, "courseId": 1, "completionPercentage": 40 },
  { "id": 2, "userId": 2, "courseId": 2, "completionPercentage": 75 }
]
```

### reviews.json
```json
[
  { "id": 1, "userId": 1, "courseId": 1, "rating": 5, "comment": "Great course" },
  { "id": 2, "userId": 2, "courseId": 2, "rating": 4, "comment": "Very useful" }
]
```

---

## 9) package.json Requirements (Per Service)

For each microservice (`user-service`, `course-service`, `enrollment-service`, `content-service`, `progress-service`, `review-service`):
- dependencies:
  - `express`
  - `swagger-ui-express`
- scripts:
  - `start`: `node server.js`

For `api-gateway`:
- dependencies:
  - `express`
  - `http-proxy-middleware`
- scripts:
  - `start`: `node server.js`

---

## 10) Run Instructions

### Option A: Start All Services Concurrently (Recommended)

From the **project root**, run:
```bash
npm install
npm start
```

All 7 services will start in parallel. Each service prefix will appear in the output (e.g., `[0]`, `[1]`, etc.).

Expected running ports:
- API Gateway: `3000`
- User Service: `3001`
- Course Service: `3002`
- Enrollment Service: `3003`
- Content Service: `3004`
- Progress Service: `3005`
- Review Service: `3006`

### Option B: Start Services Individually

Open separate terminals for each folder.

1. Install dependencies in each service folder:
```bash
npm install
```

2. Start each microservice (in separate terminals):
```bash
npm start
```

---

## 11) Testing Plan

Direct service test example:
- `GET http://localhost:3001/users`

Gateway test example:
- `GET http://localhost:3000/api/users`

Both should return valid JSON responses.

Test all CRUD endpoints for each service both ways:
- direct service URL
- API Gateway URL

---

## 12) Logging and Error Handling Rules

Every service should:
- log requests and actions with `console.log`
- return `404` when item not found
- return `400` for invalid IDs or invalid request body
- return JSON responses with clear messages

---

## 13) Notes

- IDs are auto-generated in each service.
- Input validation is intentionally basic and beginner-friendly.
- JSON files act as local storage and are updated on create/update/delete.
