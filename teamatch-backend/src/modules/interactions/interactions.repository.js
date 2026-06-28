const { intersection } = require("zod");
const { query } = require("../../db/connection");

/*
 * Creates a new interaction between two users.
 *
 * @param {Object} params
 * @param {number} params.fromUserId - The user performing the action
 * @param {number} params.toUserId - The user being interacted with
 * @param {string} params.action - Either 'like' or 'pass'
 * @returns {Promise<Object>} The created interaction row
 */
async function createInteraction({fromUserId, toUserId, action}, client) {

    const sql = `
    INSERT INTO interactions(
    from_user_id,
    to_user_id,
    action
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `;

    const values = [fromUserId, toUserId, action];

    const db = client || { query };  // use client if provided, otherwise default query

    const result = await db.query(sql, values);

    return result.rows[0]
}

/**
 * Checks if a mutual like exists between two users.
 *
 * @param {number} fromUserId - The user who performed the original like
 * @param {number} toUserId - The user who may have liked back
 * @returns {Promise<Object|undefined>} The interaction row if mutual like exists, undefined otherwise
 */
async function findMutualLike(fromUserId, toUserId) {
    const sql = `
    SELECT *
    FROM interactions
    WHERE from_user_id = $1
      AND to_user_id = $2
      AND action = 'like'
    `;

    const values = [fromUserId, toUserId];

    const result = await query(sql, values);

    return result.rows[0];
}

/**
 * Creates a new match between two users.
 * user1Id must always be the smaller ID — enforced by the service layer.
 *
 * @param {number} user1Id - The smaller of the two user IDs
 * @param {number} user2Id - The larger of the two user IDs
 * @returns {Promise<Object>} The created match row
 */
async function createMatch(user1Id, user2Id, client) {
  // user1Id is already the smaller one — service sorted it
  const sql = `
  INSERT INTO matches (user1_id, user2_id)
  VALUES ($1, $2)
  RETURNING *
  `
  const values = [user1Id, user2Id];

  const db = client || { query };  // use client if provided, otherwise default query

  const result = await db.query(sql,values);

  return result.rows[0];
}


module.exports = {
createInteraction,
findMutualLike,
createMatch
};