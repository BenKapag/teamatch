/**
 * Maps a raw database raw from user_games table to API friendly object.
 * @param {object} row - Raw DB row
 * @returns {object|null} Mapped user game object or null
 */

function mapRowToUserGame(row){
    if(!row)
        return null;

    return {
        id: row.id,
        userId: row.user_id,
        gameId: row.game_id,
        rank: row.rank,
        isMain: row.is_main,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Maps a raw joined row from user_games + games into an API-friendly object.
 *
 * Used by GET /me/games where the response should include the game name.
 *
 * @param {object} row - Raw joined DB row.
 * @returns {object|null} Mapped user game object with gameName.
 */
function mapJoinedRowToUserGame(row){
    if(!row)
        return null;

    return {
        id: row.id,
        userId: row.user_id,
        gameId: row.game_id,
        gameName: row.game_name,
        rank: row.rank,
        isMain: row.is_main,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

module.exports = {
    mapRowToUserGame,
    mapJoinedRowToUserGame,
};