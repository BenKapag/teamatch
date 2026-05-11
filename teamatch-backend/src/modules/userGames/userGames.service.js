const gamesRepository = require("../games/games.repository");
const userGamesRepository = require("./userGames.repository");
const { mapRowToUserGame } = require("./userGames.mapper");

async function addGameToCurrentUser(userId, userGameData) {
  const game = await gamesRepository.findGameById(userGameData.gameId);

  if (!game) {
    const error = new Error("Game not found");
    error.code = "GAME_NOT_FOUND";
    throw error;
  }

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