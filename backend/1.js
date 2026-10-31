const express = require("express");
const path = require("path");

const app = express();

// Database connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
app.use(express.json());

// Frontend static files
// app.use(express.static(path.join(__dirname, "../frontend")));

// API routes

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Home page
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });


// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Movie Website Backend is running successfully!"
    });
});
// Error handling
const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

app.use(notFound);
app.use(errorHandler);

// Vercel will use this app
module.exports = app;