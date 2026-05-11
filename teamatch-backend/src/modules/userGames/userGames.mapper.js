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

module.exports = {
    mapRowToUserGame,
};