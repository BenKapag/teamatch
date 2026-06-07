const userGamesService = require("./userGames.service");
const { addUserGameSchema } = require("./userGames.validation");
const { formatZodErrors } = require("../../utils/zodErrorFormatter");
const { ZodError } = require("zod");

/**
 * Handle request for adding a game to the authenticated user's profile.
 */
async function addGameToCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    // Validate request body using Zod
    const validatedData = addUserGameSchema.parse(req.body);

    const userGame = await userGamesService.addGameToCurrentUser(userId, validatedData);

    return res.status(201).json({
        message: "Game added to profile",
        userGame,
    });
  } 
  catch(error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: formatZodErrors(error)
        });
    }
    if (error.code === "GAME_NOT_FOUND") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.code === "USER_GAME_ALREADY_EXISTS") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }   
}
/**
 * Finds all the games of a current user by his id
 */
async function getCurrentUserGames(req, res) {
  try {
    const userId = req.user.id;

    const userGames = await userGamesService.getCurrentUserGames(userId);
    return res.status(200).json({
      games: userGames
    });
  }

  catch(error){
  return res.status(500).json({
    message: "Internal server error",
  });
  }
}

/**
 * Handles DELETE /me/games/:gameId
 * Removes a game from the authenticated user's game list.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function deleteCurrentUsersGame(req, res) {
  try {
    const userId = req.user.id;
    const gameId = Number(req.params.gameId);

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({ message: "gameId must be a positive integer" });
    }

    const deletedUserGame = await userGamesService.deleteCurrentUsersGame({userId, gameId});

    return res.status(200).json({
      message: "Game succesfully deleted",
      game: deletedUserGame
    });
  }

  catch(error){
    if(error.code === "GAME_NOT_FOUND"){
      return res.status(404).json({
      message: "Game not found"
      });
    }
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
    addGameToCurrentUser,
    getCurrentUserGames,
    deleteCurrentUsersGame,
}