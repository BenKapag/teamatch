const { query } = require("../../db/connection");

/**
 * Create a user-game relationship for the authenticated user.
 *
 * @param {Object} userGameData
 * @param {number} userGameData.userId - Authenticated user's ID.
 * @param {number} userGameData.gameId - Selected game ID.
 * @param {string|null} userGameData.rank - Optional rank for this game.
 * @param {boolean} userGameData.isMain - Whether this is one of the user's main games.
 * @returns {Promise<Object>} Created user-game row.
 */
async function createUserGame({userId, gameId, rank, isMain}) {
    const sql = `
    INSERT INTO user_games (
    user_id,
    game_id,
    rank,
    is_main
    )
    VALUES ($1, $2, $3, $4)
    RETURNING 
    id,
    user_id,
    game_id,
    rank,
    is_main,
    created_at,
    updated_at
    `;
    const values = [userId, gameId, rank, isMain];

    const result = await query(sql, values);

    return result.rows[0];
}

/**
 * Find all games that belong to a specific user.
 *
 * @param {number} userId - The authenticated user's database ID.
 * @returns {Promise<Array>} The list of games connected to the user.
 */
async function findUserGamesByUserId(userId) {
    const sql = `
    SELECT
    ug.id,
    ug.user_id,
    ug.game_id,
    g.name AS game_name,
    ug.rank,
    ug.is_main,
    ug.created_at,
    ug.updated_at
    FROM user_games ug
    JOIN games g ON ug.game_id = g.id
    WHERE ug.user_id = $1
    ORDER BY ug.is_main DESC, g.name ASC
    `;

    const result = await query(sql, [userId]);

    return result.rows;
}

/**
 * Deletes a game from the authenticated user's game list.
 *
 * @param {Object} params
 * @param {number} params.userId - The authenticated user's ID (from req.user.id)
 * @param {number} params.gameId - The game to remove (from req.params.gameId)
 * @returns {Object|undefined} The deleted row, or undefined if not found
 */

async function deleteCurrentUsersGame({userId, gameId}) {
    const sql = `
    DELETE
    FROM user_games
    WHERE user_id = $1 and game_id = $2
    RETURNING *
    `;

    const result = await query(sql, [userId, gameId]);
    
    return result.rows[0] || null;
}

/**
 * Updates a user's game fields
 * 
 * @param {Object} userGameData - The fields to update (rank, isMain)
 * @param {number} userGameData.userId - The authenticated user's ID
 * @param {number} userGameData.gameId - The game that belongs to the user
 * @returns {Object|null} The updated row, or null if not found
 */
async function updateCurrentUserGame({userId, gameId, userGameData}) {
    const fieldMap = {
        rank: "rank",
        isMain: "is_main"
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const key in userGameData){
        if(fieldMap[key] && userGameData[key] !== undefined) {
            updates.push(`${fieldMap[key]} = $${paramIndex}`);
            values.push(userGameData[key]);
            paramIndex++;
        }
    }

    if (updates.length === 0){
        throw new Error("no valid user game fields provided");
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    values.push(userId);
    const userParamIndex = paramIndex;
    paramIndex++;

    values.push(gameId);
    const gameIdParamIndex = paramIndex

    const sql = `
    UPDATE user_games
    SET ${updates.join(", ")}
    WHERE user_id = $${userParamIndex} and game_id = $${gameIdParamIndex}
    RETURNING *;
    `

    const result = await query(sql, values);
    
    return result.rows[0] || null;
}


module.exports = {
    createUserGame,
    findUserGamesByUserId,
    deleteCurrentUsersGame,
    updateCurrentUserGame,
}