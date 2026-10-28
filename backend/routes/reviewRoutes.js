
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addReview,
    listMovieReviews,
    editReview,
    removeReview
} = require("../controllers/reviewController");

// Movie show reviews  — public
router.get("/:movieId", listMovieReviews);

// Review create/update/delete — login required
router.post("/", authMiddleware, addReview);
router.put("/:id", authMiddleware, editReview);
router.delete("/:id", authMiddleware, removeReview);

module.exports = router;


