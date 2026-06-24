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


module.exports = {
createInteraction,
};