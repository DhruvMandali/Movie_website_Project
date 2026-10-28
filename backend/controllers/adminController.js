// backend/controllers/adminController.js

const pool = require("../config/db");
const {
    getAllReviewsForAdmin,
    deleteReviewByAdmin
} = require("../models/reviewModel");


const getDashboardStats = async (req, res, next) => {
    try {
        const [usersResult, reviewsResult, favoritesResult] =
            await Promise.all([
                pool.query("SELECT COUNT(*) FROM users"),
                pool.query("SELECT COUNT(*) FROM reviews"),
                pool.query("SELECT COUNT(*) FROM favorites")
            ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully",
            stats: {
                totalUsers: Number(usersResult.rows[0].count),
                totalReviews: Number(reviewsResult.rows[0].count),
                totalFavorites: Number(favoritesResult.rows[0].count)
            }
        });
    } catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT id, name, email, created_at, role
            FROM users
            ORDER BY id DESC
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        next(error);
    }
};


const updateUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { name, email } = req.body || {};

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid name and email are required"
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET name = $1, email = $2
             WHERE id = $3 AND role = 'user'
             RETURNING id, name, email, role, created_at`,
            [name.trim(), email.trim().toLowerCase(), userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Normal user not found or cannot be edited"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1 AND role = 'user'
             RETURNING id, name, email`,
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Normal user not found or cannot be deleted"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

const getUserActivities = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                user_id,
                user_email,
                activity,
                details,
                created_at
            FROM user_activities
            ORDER BY created_at DESC
            LIMIT 100
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            activities: result.rows
        });
    } catch (error) {
        next(error);
    }
};


const getAdminReviews = async (req, res, next) => {
    try {
        const reviews = await getAllReviewsForAdmin();

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        next(error);
    }
};

const adminDeleteReview = async (req, res, next) => {
    try {
        const reviewId = Number(req.params.id);

        if (!Number.isSafeInteger(reviewId) || reviewId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const deletedReview = await deleteReviewByAdmin(reviewId);

        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            deletedReview
        });
    } catch (error) {
        next(error);
    }
};



module.exports = { getDashboardStats , getAllUsers, updateUser,  deleteUser, getUserActivities , getAdminReviews, adminDeleteReview};