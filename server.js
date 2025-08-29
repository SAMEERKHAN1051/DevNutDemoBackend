import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import userRoutes from "./routes/userRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

// Create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
// Routes
// ✅ Public Routes
app.use("/api", routes); // e.g., /api/signup, /api/login

// ✅ Protected Routes
app.use("/api/user", userRoutes); // Requires user login
// app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 route
// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
// });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🌐 Access on network: http://${getLocalIPAddress()}:${PORT}`);
});

// Get local IP address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
