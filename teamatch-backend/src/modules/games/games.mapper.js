/**
 * Convert a raw game database row into the public API response shape.
 * 
 * @param {Object} row - Raw row returned from the games repository.
 * @returns {Object} Game object formatted for the API response.
 */

function mapRowToGame(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  };
}

module.exports = {
  mapRowToGame,
};