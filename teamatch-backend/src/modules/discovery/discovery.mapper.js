/**
 * Convert a raw discovery database row into a public API response object.
 *
 * @param {Object} row - Raw row returned from the discovery repository.
 * @returns {Object} Discovery candidate formatted for the API response.
 */
function mapRowToDiscoveryCandidate(row) {
  return {
    userId: row.user_id,
    username: row.username,
    profileId: row.profile_id,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    region: row.region,
    competitiveLevel: row.competitive_level,
    micPreference: row.mic_preference,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  mapRowToDiscoveryCandidate,
};