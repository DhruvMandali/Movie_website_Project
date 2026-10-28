
const express = require('express');
const app = express();
const path = require('path');

const connection = require("./config/db");
const authRoutes = require("./routes/authRoutes");

//favorite routes
const favoriteRoutes = require("./routes/favoriteRoutes");

// review route
const reviewRoutes = require("./routes/reviewRoutes");

// admin routes
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
const PORT = process.env.PORT || 7750;

// API routes
app.use("/api/auth", authRoutes);

//favorite route
app.use("/api/favorites", favoriteRoutes);

//review route use
app.use("/api/reviews", reviewRoutes);


//admin route use
app.use("/api/admin", adminRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: "Internal server error"
    });
});


app.get("/",(req,res)=>{
    res.send("hello dm");
     res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);
app.listen(7750,()=>
    {async () => {
            try {   await pool.query("SELECT 1");
                console.log("PostgreSQL connected successfully");
            } catch (error) {
                console.error("PostgreSQL connection error:", error.message);
            }
    }

        console.log("server code:-7750");
})



