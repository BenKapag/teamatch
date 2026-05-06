const gamesRepository = require("./games.repository");
const { mapRowToGame } = require("./games.mapper");

/**
 * Get all games from the platform catalog.
 *
 * The service layer coordinates repository data and maps it into
 * the API response shape.
 *
 * @returns {Promise<Array>} Games formatted for the API response.
 */
async function getAllGames() {
  const rows = await gamesRepository.findAllGames();

  return rows.map(mapRowToGame);
}

module.exports = {
  getAllGames,
};