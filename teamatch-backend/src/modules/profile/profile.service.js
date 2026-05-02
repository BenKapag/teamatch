const profileRepository = require("./profile.repository");
const { mapRowToProfile } = require("./profile.mapper");

/**
 * Get the authenticated user's profile.
 *
 * @param {number} userId - Authenticated user's ID.
 * @returns {Promise<object>} API-friendly profile object.
 */
async function getCurrentUserProfile(userId) {
  const profile = await profileRepository.findByUserId(userId);

  if (!profile) {
    throw new Error("profile not found");
  }

  return mapRowToProfile(profile);
}

module.exports = {
  getCurrentUserProfile,
};