const gamesService = require("./games.service");

/**
 * Handle request for fetching the platform games catalog.
 */
async function getAllGames(req, res) {
  try {
    const games = await gamesService.getAllGames();

    return res.status(200).json({
      games,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getAllGames,
};