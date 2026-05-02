/**
 * Map a raw database row from user_profiles table
 * into a clean API-friendly object.
 *
 * @param {object} row - Raw DB row
 * @returns {object|null} Mapped profile object or null
 */
function mapRowToProfile(row) {
  // If no row found, return null (important for service logic)
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    region: row.region,
    competitiveLevel: row.competitive_level,
    micPreference: row.mic_preference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  mapRowToProfile,
};