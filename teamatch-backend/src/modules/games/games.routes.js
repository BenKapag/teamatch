const express = require("express");
const gamesController = require("./games.controller");

const router = express.Router();

/**
 * Get the platform games catalog.
 */
router.get("/", gamesController.getAllGames);

module.exports = router;