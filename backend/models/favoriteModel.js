const pool = require("../config/db");

const addFavorite = async (userId, movieId) => {
    const result = await pool.query(
        `INSERT INTO favorites (user_id, movie_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, movie_id) DO NOTHING
         RETURNING id, user_id, movie_id, created_at`,
        [userId, movieId]
    );

    return result.rows[0];
};

const getFavorites = async (userId) => {
    const result = await pool.query(
        `SELECT id, movie_id, created_at
         FROM favorites
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

const removeFavorite = async (userId, movieId) => {
    const result = await pool.query(
        `DELETE FROM favorites
         WHERE user_id = $1 AND movie_id = $2
         RETURNING id`,
        [userId, movieId]
    );

    return result.rowCount > 0;
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};



