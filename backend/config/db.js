
const { Pool } = require("pg");
const path = require("path");

// Load local .env file during development.
// On Vercel, environment variables are configured in the dashboard.
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({
        path: path.join(__dirname, "../.env")
    });
}

const pool = new Pool({
    // Hosted database can use DATABASE_URL
    connectionString: process.env.DATABASE_URL || undefined,

    // Local database can use individual variables
    user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
    host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
    database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
    password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
    port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT),

    // SSL for hosted PostgreSQL in production
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,

    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});

module.exports = pool;

    
    
    
    
    // require("dotenv").config();

// const pool = new Pool({
//     host : "localhost",
//     port : 5432,
//     user : "postgres",
//     password : "123",
//     database : "Movie_website"
// });