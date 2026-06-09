const gamesRepository = require("../games/games.repository");
const userGamesRepository = require("./userGames.repository");
const { mapRowToUserGame, mapJoinedRowToUserGame } = require("./userGames.mapper");

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

/**
 * Find all games that belong to a specific user.
 *
 * @param {number} userId - The authenticated user's database ID.
 * @returns {Promise<Array>} User games formatted for the API response
 */
async function getCurrentUserGames(userId) {
  const rows = await userGamesRepository.findUserGamesByUserId(userId);

  return rows.map(mapJoinedRowToUserGame);
}

/**
 * Removes a game from the authenticated user's game list.
 * Throws if the user does not have that game.
 *
 * @param {Object} params
 * @param {number} params.userId - The authenticated user's ID (from req.user.id)
 * @param {number} params.gameId - The game to remove (from req.params.gameId)
 * @returns {Object} The deleted user game
 * @throws {Error} GAME_NOT_FOUND - if the user does not have this game
 */
async function deleteCurrentUsersGame({ userId, gameId }) {
  
  const row = await userGamesRepository.deleteCurrentUsersGame({userId, gameId});

  if (!row){

    const error = new Error("The game doesnt exist");
    error.code = "GAME_NOT_FOUND"
    throw error;
  }

  return mapRowToUserGame(row);
}

/**
 * Updates a user game row by given fields 
 * 
 * @param {Object} params
 * @param {number} params.userId - The authenticated user's ID (from req.user.id)
 * @param {number} params.gameId - The game that belongs to the user
 * @param {Object} params.userGameData - The fields that the user wants to update
 * @returns {Object} The updated user game
 * @throws {Error} GAME_NOT_FOUND - if the user does not have this game
 */
async function updateCurrentUserGame({userId, gameId, userGameData}) {

  const row = await userGamesRepository.updateCurrentUserGame({userId, gameId, userGameData});

  if(!row){
    const error = new Error("Game not found in your profile");
    error.code = "GAME_NOT_FOUND"
    throw error;
  }

  return mapRowToUserGame(row)
}


module.exports = {
  addGameToCurrentUser,
  getCurrentUserGames,
  deleteCurrentUsersGame,
  updateCurrentUserGame,
};