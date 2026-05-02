const { query } = require("../../db/connection");

/**
 * Create an empty profile for a newly registered user.
 *
 * @param {number} userId - The ID of the user who owns the profile.
 * @param {{ query: Function }} [client] - Optional database client used for transactions.
 * @returns {Promise<object>} The created profile row.
 */
async function createProfile(userId, client) {
  // Use the transaction client when provided.
  // Otherwise, fall back to the default query function for normal single-query usage.
  const db = client || { query };

  const sql = `
    INSERT INTO user_profiles (user_id)
    VALUES ($1)
    RETURNING *;
  `;

  const result = await db.query(sql, [userId]);
  return result.rows[0];
}

/**
 * Find a user profile by the owning user's ID.
 *
 * @param {number} userId - The authenticated user's ID.
 * @returns {Promise<object|null>} The profile row, or null if no profile exists.
 */
async function findByUserId(userId) {
  const sql = `
    SELECT *
    FROM user_profiles
    WHERE user_id = $1;
  `;

  const result = await query(sql, [userId]);
  return result.rows[0] || null;
}

/**
 * Partially update a user's profile.
 *
 * This function implements PATCH behavior:
 * only fields provided in profileData will be updated.
 *
 * @param {number} userId - The authenticated user's ID.
 * @param {object} profileData - Allowed profile fields to update.
 * @returns {Promise<object|null>} Updated profile row, or null if not found.
 */
async function updateByUserId(userId, profileData) {
  const fieldMap = {
    displayName: "display_name",
    bio: "bio",
    avatarUrl: "avatar_url",
    region: "region",
    competitiveLevel: "competitive_level",
    micPreference: "mic_preference",
  };

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const key in profileData) {
    if (fieldMap[key] && profileData[key] !== undefined) {
      updates.push(`${fieldMap[key]} = $${paramIndex}`);
      values.push(profileData[key]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    throw new Error("no valid profile fields provided");
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");

  values.push(userId);

  const sql = `
    UPDATE user_profiles
    SET ${updates.join(", ")}
    WHERE user_id = $${paramIndex}
    RETURNING *;
  `;

  const result = await query(sql, values);
  return result.rows[0] || null;
}

module.exports = {
  createProfile,
  findByUserId,
  updateByUserId,
};