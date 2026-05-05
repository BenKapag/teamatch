const { query } = require("../../db/connection");

/**
 * Find potential discovery candidates by region.
 *
 * Current discovery rules:
 * - Exclude the authenticated user.
 * - Only return users that have a profile.
 * - Only return users from the same region.
 *
 * @param {Object} params
 * @param {number} params.userId - The authenticated user's ID.
 * @param {string} params.region - The authenticated user's region.
 * @returns {Promise<Array>} Raw database rows for matching candidates.
 */
async function findCandidatesByRegion({ userId, region }) {
  const result = await query(
    `
    SELECT
      u.id AS user_id,
      u.username,
      p.id AS profile_id,
      p.display_name,
      p.bio,
      p.avatar_url,
      p.region,
      p.competitive_level,
      p.mic_preference,
      p.updated_at
    FROM users u
    INNER JOIN user_profiles p
      ON p.user_id = u.id
    WHERE u.id <> $1
      AND p.region = $2
    ORDER BY p.updated_at DESC
    `,
    [userId, region]
  );

  return result.rows;
}

module.exports = {
  findCandidatesByRegion,
};