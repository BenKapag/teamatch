/**
 * Map a raw database row from interactions table
 * into a clean API-friendly object.
 *
 * @param {object} row - Raw DB row
 * @returns {object|null} Mapped interaction object or null
 */
function mapRowToInteraction(row) {
  // If no row found, return null (important for service logic)
  if (!row) return null;

  return {
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    action: row.action,
    createdAt: row.created_at
  };
}

/**
 * Map a raw database row from matche table
 * into a clean API-friendly object.
 *
 * @param {object} row - Raw DB row
 * @returns {object|null} Mapped match object or null
 */
function mapRowToMatch(row) {
  // If no row found, return null (important for service logic)
  if (!row) return null;

  return {
    id: row.id,
    user1Id: row.user1_id,
    user2Id: row.user2_id,
    status: row.status,
    createdAt: row.created_at
  };
}

module.exports = {
  mapRowToInteraction,
  mapRowToMatch,
};