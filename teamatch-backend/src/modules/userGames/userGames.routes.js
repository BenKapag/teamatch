const express = require("express");
const userGamesController = require("./userGames.controller");
const { authMiddleware } = require("../auth/auth.middleware");

const router = express.Router();

/**
 * POST /me/games
 * Add a game from the catalog to the authenticated user's profile.
 */
router.post("/", authMiddleware, userGamesController.addGameToCurrentUser);

/**
 * GET /me/games
 * Returns all the games of a current authenticated user
 */
router.get("/", authMiddleware, userGamesController.getCurrentUserGames);

module.exports = router;