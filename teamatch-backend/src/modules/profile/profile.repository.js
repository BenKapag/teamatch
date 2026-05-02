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

module.exports = {
  createProfile,
  findByUserId,
};