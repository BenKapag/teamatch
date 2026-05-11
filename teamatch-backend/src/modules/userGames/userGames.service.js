const gamesRepository = require("../games/games.repository");
const userGamesRepository = require("./userGames.repository");
const { mapRowToUserGame } = require("./userGames.mapper");

/**
 * Add a game from the catalog to the authenticated user's profile.
 *
 * - The selected game must exist in the games catalog.
 * - A user cannot add the same game more than once.
 *
 * @param {number} userId - Authenticated user's ID.
 * @param {Object} userGameData - Validated request body.
 * @returns {Promise<Object>} Created user-game object formatted for the API.
 */
async function addGameToCurrentUser(userId, userGameData) {
  const game = await gamesRepository.findGameById(userGameData.gameId);

  if (!game) {
    const error = new Error("Game not found");
    error.code = "GAME_NOT_FOUND";
    throw error;
  }

  //If isMain is not provided, it defaults to false
  const isMain = userGameData.isMain ?? false;

  try {
    const userGame = await userGamesRepository.createUserGame({
      userId,
      gameId: userGameData.gameId,
      rank: userGameData.rank ?? null,
      isMain,
    });

    return mapRowToUserGame(userGame);
  } catch (error) {
    if (error.code === "23505") {
      const duplicateError = new Error("Game already added to profile");
      duplicateError.code = "USER_GAME_ALREADY_EXISTS";
      throw duplicateError;
    }

    throw error;
  }
}

module.exports = {
  addGameToCurrentUser,
};