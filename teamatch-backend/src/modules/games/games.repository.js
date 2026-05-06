const { query } = require("../../db/connection");

/**
 * Fetch all games from the platform games catalog.
 *
 * The games table stores the list of games that users can select
 * and attach to their profile.
 *
 * @returns {Promise<Array>} Raw game rows from the database.
 */
async function findAllGames() {
  const sql = `
    SELECT
      id,
      name,
      created_at
    FROM games
    ORDER BY name ASC
  `;

  const result = await query(sql);

  return result.rows;
}

module.exports = {
  findAllGames,
};