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

/**
 * DELETE /me/games/:gameId
 * Deletes a game of a current authenticated user
 */
router.delete("/:gameId", authMiddleware, userGamesController.deleteCurrentUsersGame);

/**
 * PATCH /me/games/:gameId
 * Updates a game of a current authenticated user
 */
router.patch("/:gameId", authMiddleware, userGamesController.updateCurrentUserGame);

module.exports = router;