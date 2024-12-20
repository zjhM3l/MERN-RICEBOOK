import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import mainRoutes from "./routes/main.route.js";

dotenv.config();

// Connect to MongoDB using credentials from the environment variable
mongoose
  .connect('mongodb+srv://jz185:ZhangJiaHe20020607@mern-ricebook.odu98.mongodb.net/?retryWrites=true&w=majority&appName=mern-ricebook')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Set the maximum file size limit for incoming requests (e.g., 5MB)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Define routes for user, authentication, and main operations
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/main", mainRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    // Handle requests that exceed the file size limit
    res.status(413).json({ message: "Payload Too Large. File is too big." });
  } else {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Generic error handler for other types of errors
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
});
