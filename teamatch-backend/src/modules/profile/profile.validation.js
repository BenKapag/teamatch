const { z } = require("zod");

/**
 * Validation schema for PATCH /profile.
 *
 * All fields are optional because PATCH updates only the fields provided.
 */
const updateProfileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  region: z.string().optional(),
  competitiveLevel: z.string().optional(),
  micPreference: z.string().optional(),
}).strict();

module.exports = {
  updateProfileSchema,
};