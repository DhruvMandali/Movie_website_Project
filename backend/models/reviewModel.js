
const pool = require("../config/db");

const createReview = async (userId, movieId, review) => {
    const result = await pool.query(
        `INSERT INTO reviews (user_id, movie_id, review)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, movie_id, review, created_at`,
        [userId, movieId, review]
    );

    return result.rows[0];
};

const getReviewsByMovie = async (movieId) => {
    const result = await pool.query(
        `SELECT
  r.id,
  r.user_id,
  r.movie_id,
  r.review,
  r.created_at,
  r.updated_at,
  u.name AS user_name
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.movie_id = $1
ORDER BY r.created_at DESC`,
        [movieId]
    );

    return result.rows;
};


const updateReview = async (userId, reviewId, review) => {
    const result = await pool.query(
        `UPDATE reviews
         SET review = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING id, movie_id, review, updated_at`,
        [review, reviewId, userId]
    );

    return result.rows[0];
};

const deleteReview = async (userId, reviewId) => {
    const result = await pool.query(
        `DELETE FROM reviews
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [reviewId, userId]
    );

    return result.rowCount > 0;
};
const getAllReviewsForAdmin = async () => {
    const result = await pool.query(`
        SELECT
            r.id,
            r.user_id,
            u.name AS user_name,
            u.email AS user_email,
            r.movie_id,
            r.review,
            r.created_at
        FROM reviews r
        LEFT JOIN users u ON u.id = r.user_id
        ORDER BY r.created_at DESC
    `);

    return result.rows;
};

const deleteReviewByAdmin = async (reviewId) => {
    const result = await pool.query(
        `DELETE FROM reviews
         WHERE id = $1
         RETURNING id, user_id, movie_id`,
        [reviewId]
    );

    return result.rows[0] || null;
};


module.exports = {
    createReview,
    getReviewsByMovie,
    updateReview,
    deleteReview,
    getAllReviewsForAdmin,
    deleteReviewByAdmin
};



