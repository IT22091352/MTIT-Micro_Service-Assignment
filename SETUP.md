# Project Setup Guide

Complete step-by-step instructions for setting up the MTIT LMS Microservices project on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository) - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** (for cloud database) - [Create Free Account](https://www.mongodb.com/cloud/atlas)

Verify installation:
```bash
node --version
npm --version
git --version
```

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MTIT-Group-Assignment
```

---

## Step 2: Install Dependencies

Install all root-level dependencies (including concurrent startup and port cleanup utilities):

```bash
npm install
```

This installs:
- `concurrently` - runs multiple services simultaneously
- `kill-port` - automatically cleans up ports before startup (prevents EADDRINUSE errors)
- `mongoose` - MongoDB object mapper
- `express` - web framework
- `dotenv` - environment variable management
- `cors` - cross-origin resource sharing

---

## Step 3: Configure MongoDB Connection

### Option A: Using MongoDB Atlas (Recommended for Production/Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier available)
4. Click "Connect" and copy your connection string:
   ```
   mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name
   ```

5. Create a `.env` file in the **project root** with:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/lms_service
   ```

6. Create a `.env` file in **each service folder** (user-service, course-service, etc.) with the same URI:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/lms_service
   ```

### Option B: Using Local MongoDB

1. Install and run MongoDB locally:
   ```bash
   # Windows (if MongoDB installed globally)
   mongod
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. The project uses these default local URIs (already configured in code):
   - `mongodb://127.0.0.1:27017/lms_user_service`
   - `mongodb://127.0.0.1:27017/lms_course_service`
   - `mongodb://127.0.0.1:27017/lms_enrollment_service`
   - `mongodb://127.0.0.1:27017/lms_content_service`
   - `mongodb://127.0.0.1:27017/lms_progress_service`
   - `mongodb://127.0.0.1:27017/lms_review_service`

---

## Step 4: Verify Project Structure

The project should have this structure:

```
MTIT-Group-Assignment/
├── api-gateway/              (Port 3000 - Request routing)
├── user-service/             (Port 3001 - User management)
├── course-service/           (Port 3002 - Course management)
├── enrollment-service/       (Port 3003 - Enrollment management)
├── content-service/          (Port 3004 - Content management)
├── progress-service/         (Port 3005 - Learning progress tracking)
├── review-service/           (Port 3006 - Course reviews)
├── package.json              (Root dependencies & startup scripts)
├── .env                       (Environment variables - create this)
├── README.md                 (Project overview)
├── SETUP.md                  (This file)
└── node_modules/             (Installed packages)
```

---

## Step 5: Start the Project

### Start All Services at Once

Run from the **project root** directory:

```bash
npm start
```

What happens:
1. Automatically kills any processes running on ports 3000-3006 (prevents port conflicts)
2. Starts all 7 services concurrently (API Gateway + 6 microservices)
3. Each service connects to MongoDB

Expected output:
```
[0] [API Gateway] Running on port 3000
[1] [User Service] Running on port 3001 - Connected to MongoDB
[2] [Course Service] Running on port 3002 - Connected to MongoDB
[3] [Enrollment Service] Running on port 3003 - Connected to MongoDB
[4] [Content Service] Running on port 3004 - Connected to MongoDB
[5] [Progress Service] Running on port 3005 - Connected to MongoDB
[6] [Review Service] Running on port 3006 - Connected to MongoDB
```

### Stop Services

Press `Ctrl+C` in the terminal to stop all services.

---

## Step 6: Test the API

### Using Postman or Curl

#### 1. Create a User (via API Gateway)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

#### 2. Get All Users
```bash
curl http://localhost:3000/api/users
```

#### 3. Create a Course
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Node.js Basics","description":"Learn Node.js"}'
```

### View Swagger Documentation

Each microservice has Swagger API documentation:

- **API Gateway**: http://localhost:3000/api-docs
- **User Service**: http://localhost:3001/api-docs
- **Course Service**: http://localhost:3002/api-docs
- **Enrollment Service**: http://localhost:3003/api-docs
- **Content Service**: http://localhost:3004/api-docs
- **Progress Service**: http://localhost:3005/api-docs
- **Review Service**: http://localhost:3006/api-docs

Open any of these URLs in your browser to explore and test the APIs.

---

## Step 7: Troubleshooting

### Port Already in Use (EADDRINUSE)

If you get "address already in use" errors:

**Automatic Solution (Already Implemented)**:
The startup script (`npm start`) automatically cleans ports 3000-3006 before starting services.

**Manual Solution** (if needed):
```bash
# Kill processes on specific ports
npx kill-port 3000 3001 3002 3003 3004 3005 3006

# Then try starting again
npm start
```

### MongoDB Connection Fails

**Check local MongoDB**:
```bash
# Test if MongoDB is running locally
mongosh  # or mongo (older versions)
```

**Check Atlas connection**:
1. Verify your `MONGODB_URI` in `.env` files is correct
2. Ensure IP address is whitelisted in MongoDB Atlas network settings
3. Check username and password are correct in the URI

**Check DNS Issues** (MongoDB Atlas only):
The project uses public DNS resolvers (8.8.8.8, 1.1.1.1) to resolve MongoDB SRV records. If you still have issues:
1. Verify internet connection
2. Try switching SRV URI to standard connection string (non-SRV)

### Services Won't Start

1. **Check ports are open**:
   ```bash
   npm run stop-ports  # Manual cleanup
   ```

2. **Check dependencies installed**:
   ```bash
   npm ls
   ```

3. **Check Node.js version**:
   ```bash
   node --version  # Should be v16 or higher
   ```

4. **Clear npm cache**:
   ```bash
   npm cache clean --force
   npm install
   ```

---

## Project Architecture

```
Client Requests
       ↓
   API Gateway (Port 3000)
   ↓   ↓   ↓   ↓   ↓   ↓
   |   |   |   |   |   └─→ Review Service (3006)
   |   |   |   |   └────→ Progress Service (3005)
   |   |   |   └───────→ Content Service (3004)
   |   |   └──────────→ Enrollment Service (3003)
   |   └─────────────→ Course Service (3002)
   └────────────────→ User Service (3001)
        ↓ ↓ ↓ ↓ ↓ ↓
      MongoDB Atlas (Single Database)
```

Each microservice:
- Handles its own business logic
- Has its own models and controllers
- Connects independently to MongoDB
- Exposes REST APIs
- Includes Swagger documentation

---

## Environment Variables Reference

### Root `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_service
```

### Service `.env` files (same for each):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_service
```

---

## Next Steps

1. ✅ Verify all services start (`npm start`)
2. ✅ Test API endpoints via Swagger docs
3. ✅ Review code in each service folder
4. ✅ Modify models/controllers as needed for your assignment
5. ✅ Run tests (if configured)
6. ✅ Deploy when ready

---

## Support

- **Node.js Docs**: https://nodejs.org/docs/
- **Express.js Guide**: https://expressjs.com/
- **Mongoose Documentation**: https://mongoosejs.com/
- **MongoDB Atlas Help**: https://www.mongodb.com/docs/atlas/

---

**Last Updated**: March 2026  
**Project**: MTIT LMS Group Assignment
