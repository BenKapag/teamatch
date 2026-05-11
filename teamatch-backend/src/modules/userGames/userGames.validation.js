//userGames.validation.js
const { z } = require("zod");

/**
 * Validation schema for POST /me/games.
 *
 * Validates the request body used when the authenticated user
 * adds a game from the platform catalog to their profile.
 */
const addUserGameSchema = z
  .object({
    gameId: z.number().int().positive(),
    rank: z.string().max(100).optional(),
    isMain: z.boolean().optional(),
  })
  .strict();

module.exports = {
  addUserGameSchema,
};