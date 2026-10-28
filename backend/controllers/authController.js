const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


const {
    createUser,
    findUserByEmail
} = require("../models/userModel");

async function logUserActivity(userId, email, activity, details) {
    try {
        await pool.query(
            `INSERT INTO user_activities
             (user_id, user_email, activity, details)
             VALUES ($1, $2, $3, $4)`,
            [userId, email, activity, details]
        );
    } catch (error) {
        // Logging failure should not break login or registration.
        console.error("Activity logging failed:", error.message);
    }
}
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8
        ) {
            return res.status(400).json({
                message: "Name, valid email and password of at least 8 characters are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await createUser(
            name.trim(),
            normalizedEmail,
            passwordHash
        );
        await logUserActivity(
            user.id,
            user.email,
            "user_registered",
            "User registered successfully"
        );

        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        next(error);
    }
};


// Existing bcrypt model LoginUSer
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await findUserByEmail(
            email.trim().toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        const token = jwt.sign(
         {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    await logUserActivity(
    user.id,
    user.email,
    "user_login",
    "User logged in successfully"
);
        // const token = jwt.sign(
        //     { id: user.id, },
        //     // email: user.email 
        //     process.env.JWT_SECRET,
        //     { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        //     // { expiresIn: "8s" }
        // );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    });
};


module.exports = { registerUser ,loginUser, getProfile};