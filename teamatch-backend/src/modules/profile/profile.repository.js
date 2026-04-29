const { query } = require("../../db/connection");

async function createProfile(userId) {
  const query = `
    INSERT INTO user_profiles (user_id)
    VALUES ($1)
    RETURNING *;
  `;

  const result = await db.query(query, [userId]);
  return result.rows[0];
}

module.exports = {
  createProfile,
};