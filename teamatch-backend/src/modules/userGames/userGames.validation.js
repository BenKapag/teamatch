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

const updateUserGameSchema = z
  .object({
    rank: z.string().max(100).optional(),
    isMain: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => data.rank !== undefined || data.isMain !== undefined,
    { message: "At least one field must be provided" }
  );

module.exports = {
  addUserGameSchema,
  updateUserGameSchema
};