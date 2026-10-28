const pool = require("../config/db");
const {
    createReview,
    getReviewsByMovie,
    updateReview,
    deleteReview
} = require("../models/reviewModel");


const logUserActivity = async (userId, email, activity, details) => {
    try {
        await pool.query(
            `INSERT INTO user_activities
             (user_id, user_email, activity, details)
             VALUES ($1, $2, $3, $4)`,
            [userId, email, activity, details]
        );
    } catch (error) {
        console.error("Activity logging failed:", error.message);
    }
};


const addReview = async (req, res, next) => {
    try {
        const movieId = Number(req.body?.movieId);
        const { review } = req.body || {};
        if (
  !Number.isSafeInteger(movieId) ||
  movieId <= 0 ||
  typeof review !== "string" ||
  review.trim().length < 2 ||
  review.trim().length > 2000
) {
  return res.status(400).json({
    message: "Valid movieId and review text (2-2000 characters) are required."
  });
}

        // if (
        //     !Number.isSafeInteger(movieId) ||
        //     movieId <= 0 ||
        //     typeof review !== "string" ||
        //     !review.trim()
        // ) {
        //     return res.status(400).json({
        //         message: "Valid movieId and review text are required"
        //     });
        // }

        const result = await createReview(
            req.user.id,
            movieId,
            review.trim()
        );
        await logUserActivity(
    req.user.id,
    req.user.email,
    "review_submitted",
    `Review submitted for Movie ID ${movieId}`
);

        return res.status(201).json({
            message: "Review added successfully",
            review: result
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "You already reviewed this movie. Update your existing review."
            });
        }

        next(error);
    }
};

const listMovieReviews = async (req, res, next) => {
    try {
        const movieId = Number(req.params.movieId);

        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        const reviews = await getReviewsByMovie(movieId);

        return res.status(200).json({ reviews });
    } catch (error) {
        next(error);
    }
};

const editReview = async (req, res, next) => {
    try {
        const reviewId = Number(req.params.id);
        const { review } = req.body || {};

        if (
            !Number.isSafeInteger(reviewId) ||
            reviewId <= 0 ||
            typeof review !== "string" ||
              review.trim().length < 2 ||
            review.trim().length > 2000
        ) {
            return res.status(400).json({
                message: "Valid review ID and review text are required"
            });
        }

        const result = await updateReview(
            req.user.id,
            reviewId,
            review.trim()
        );

        if (!result) {
            return res.status(404).json({
                message: "Review not found or you do not own it"
            });
        }

        return res.status(200).json({
            message: "Review updated successfully",
            review: result
        });
    } catch (error) {
        next(error);
    }
};

const removeReview = async (req, res, next) => {
    try {
        const reviewId = Number(req.params.id);

        if (!Number.isSafeInteger(reviewId) || reviewId <= 0) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        const deleted = await deleteReview(
            req.user.id,
            reviewId
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Review not found or you do not own it"
            });
        }

        return res.status(200).json({
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addReview,
    listMovieReviews,
    editReview,
    removeReview
};





