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
async function createInteraction({fromUserId, toUserId, action}) {
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

    const result = await query(sql, values);

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


module.exports = {
createInteraction,
findMutualLike,
};