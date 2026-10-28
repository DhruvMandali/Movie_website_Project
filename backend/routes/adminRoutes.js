
const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserActivities,
    getAdminReviews,
    adminDeleteReview
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

// console.log("authMiddleware:", typeof authMiddleware);
// console.log("adminMiddleware:", typeof adminMiddleware);
// console.log("updateUser:", typeof updateUser);
// console.log("deleteUser:", typeof deleteUser);

router.put(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    updateUser
);

router.delete(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);

router.get(
    "/activities",
    authMiddleware,
    adminMiddleware,
    getUserActivities
);
router.get(
    "/reviews",
    authMiddleware,
    adminMiddleware,
    getAdminReviews
);

router.delete(
    "/reviews/:id",
    authMiddleware,
    adminMiddleware,
    adminDeleteReview
);

module.exports = router;
