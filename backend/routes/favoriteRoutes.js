const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
router.use(authMiddleware);

const {
    addFavoriteMovie,
    listFavoriteMovies,
    deleteFavoriteMovie
} = require("../controllers/favoriteController");


router.post("/", addFavoriteMovie);
router.get("/", listFavoriteMovies);
router.delete("/:movieId", deleteFavoriteMovie);

module.exports = router;


