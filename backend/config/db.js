const { Pool } = require("pg");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../Process.env")
});


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
pool.connect()
.then(() => {
    console.log("PostgreSQL connected successfully");
})
    .catch((error) => {
        console.log("PostgreSQL connection error:", error.message);
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