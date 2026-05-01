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

module.exports = {
  createProfile,
};