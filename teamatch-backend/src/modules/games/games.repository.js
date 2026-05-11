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

/**
 * Finds a game by its ID.
 * 
 * @param {number} gameId - Game Id 
 * @returns {Promise<Object|null>} Raw game row from the database, otherwise null.
 */
async function findGameById(gameId){
  const sql = `
    SELECT
      id,
      name,
      created_at
    FROM games
    WHERE id = $1
  `;

  const result = await query(sql, [gameId]);

  return result.rows[0] || null;
}

module.exports = {
  findAllGames,
  findGameById,
};