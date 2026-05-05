const profileRepository = require("../profile/profile.repository");
const discoveryRepository = require("./discovery.repository");
const { mapRowToDiscoveryCandidate } = require("./discovery.mapper");

/**
 * Get discovery candidates for the authenticated user.
 *
 * Business rules:
 * - The current user must have a profile.
 * - The current user must have a region before discovery can work.
 * - Candidates are currently filtered by same region.
 *
 * @param {number} currentUserId - Authenticated user's ID.
 * @returns {Promise<Array>} Discovery candidates formatted for the API response.
 */
async function getDiscoveryCandidates(currentUserId) {
  const currentProfile = await profileRepository.findByUserId(currentUserId);

  if (!currentProfile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (!currentProfile.region) {
    const error = new Error("Complete your profile before discovering candidates");
    error.statusCode = 400;
    error.missingFields = ["region"];
    throw error;
  }

  const rows = await discoveryRepository.findCandidatesByRegion({
    userId: currentUserId,
    region: currentProfile.region,
  });

  return rows.map(mapRowToDiscoveryCandidate);
}

module.exports = {
  getDiscoveryCandidates,
};