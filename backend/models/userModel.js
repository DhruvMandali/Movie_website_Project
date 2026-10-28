const pool = require("../config/db");

const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;

    const result = await pool.query(query, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, name, email, password_hash, role
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};