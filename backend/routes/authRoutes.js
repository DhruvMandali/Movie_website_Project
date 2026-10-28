const express = require("express");
const router = express.Router();

const { registerUser,loginUser,getProfile } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

//registrer rout
router.post("/register", registerUser);

//loginrout
router.post("/login", loginUser);

// Protected route
router.get("/profile", authMiddleware, getProfile);
module.exports = router;   

