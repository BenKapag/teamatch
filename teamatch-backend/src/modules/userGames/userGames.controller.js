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

module.exports = {
    addGameToCurrentUser,
}