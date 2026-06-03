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
async function findAllGames(userId) {
    const sql = `
    SELECT
    g.id,
    g.name,
    ug.rank,
    ug.is_main AS "isMain"
    FROM user_games ug
    JOIN games g ON ug.game_id = g.id
    WHERE ug.user_id = $1
    ORDER BY ug.is_main DESC, g.name ASC
    `;

    const result = await query(sql, [userId]);

    return result.rows;
}


module.exports = {
    createUserGame,
    findAllGames,
}