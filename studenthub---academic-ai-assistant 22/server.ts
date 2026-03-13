import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import aiRoute from "./backend/routes/aiRoute.ts";
import authRoutes from "./backend/routes/auth.ts";
import userRoutes from "./backend/routes/user.ts";
import searchRoutes from "./backend/routes/search.ts";
import historyRoutes from "./backend/routes/history.ts";
import { errorHandler } from "./backend/middleware/errorHandler.ts";
import { apiLimiter } from "./backend/middleware/rateLimiter.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy - required for express-rate-limit to work correctly behind Cloud Run/Nginx
  app.set("trust proxy", 1);

  app.use(express.json());

  // Rate limiting for all API routes
  app.use("/api", apiLimiter);

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/studenthub";
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

  // API Routes
  app.use("/api/ai", aiRoute);
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/history", historyRoutes);

  // Global Error Handler
  app.use(errorHandler);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
