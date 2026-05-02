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

/**
 * Update the authenticated user's profile.
 *
 * @param {number} userId - Authenticated user's ID.
 * @param {object} profileData - Profile fields from request body.
 * @returns {Promise<object>} Updated API-friendly profile object.
 */
async function updateCurrentUserProfile(userId, profileData) {
  const updatedProfile = await profileRepository.updateByUserId(
    userId,
    profileData
  );

  if (!updatedProfile) {
    throw new Error("profile not found");
  }

  return mapRowToProfile(updatedProfile);
}

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
};