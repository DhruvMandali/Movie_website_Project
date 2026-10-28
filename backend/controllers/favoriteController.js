
const pool = require("../config/db");

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../models/favoriteModel");

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

const addFavoriteMovie = async (req, res, next) => {
    try {
        const movieId = Number(req.body.movieId);

        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            return res.status(400).json({
                message: "Valid movieId is required"
            });
        }

        const favorite = await addFavorite(req.user.id, movieId);

        if (!favorite) {
            return res.status(409).json({
                message: "Movie is already in favorites"
            });
        }

        await logUserActivity(
            req.user.id,
            req.user.email,
            "favorite_added",
            `Movie ID ${movieId} added to favorites`
        );

        return res.status(201).json({
            message: "Movie added to favorites",
            favorite
        });
    } catch (error) {
        next(error);
    }
};

const listFavoriteMovies = async (req, res, next) => {
    try {
        const favorites = await getFavorites(req.user.id);
        return res.status(200).json({ favorites });
    } catch (error) {
        next(error);
    }
};

const deleteFavoriteMovie = async (req, res, next) => {
    try {
        const movieId = Number(req.params.movieId);

        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            return res.status(400).json({
                message: "Valid movieId is required"
            });
        }

        const removed = await removeFavorite(req.user.id, movieId);

        if (!removed) {
            return res.status(404).json({
                message: "Favorite movie not found"
            });
        }

        await logUserActivity(
            req.user.id,
            req.user.email,
            "favorite_removed",
            `Movie ID ${movieId} removed from favorites`
        );

        return res.status(200).json({
            message: "Movie removed from favorites"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addFavoriteMovie,
    listFavoriteMovies,
    deleteFavoriteMovie
};
