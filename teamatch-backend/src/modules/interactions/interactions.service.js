const { pool } = require("../../db/connection");
const interactionsRepository = require("./interactions.repository");
const { mapRowToInteraction, mapRowToMatch } = require("./interactions.mapper");

/**
 * Records a like or pass interaction between two users.
 * If a mutual like is detected, creates a match automatically.
 * Uses a transaction to ensure both operations succeed or fail together.
 *
 * @param {number} fromUserId - The authenticated user performing the action
 * @param {number} toUserId - The candidate being interacted with
 * @param {string} action - Either 'like' or 'pass'
 * @returns {Promise<Object>} The interaction and match (if created)
 */
async function interactWithUser(fromUserId, toUserId, action) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Database call to save the like/pass interaction
        const interaction = await interactionsRepository.createInteraction({ fromUserId, toUserId, action }, client);
        let match = null;

        // If action is 'like', check for mutual like
        if (action === 'like') {
            const mutualLike = await interactionsRepository.findMutualLike(toUserId, fromUserId);

            if (mutualLike) {
                // Mutual like exists, create a match
                const user1Id = Math.min(fromUserId, toUserId);
                const user2Id = Math.max(fromUserId, toUserId);
                match = await interactionsRepository.createMatch(user1Id, user2Id, client);
            }
        }
        await client.query("COMMIT");

        return {
            interactionData: mapRowToInteraction(interaction),
            match: mapRowToMatch(match)
        }


    } catch (error) {

        await client.query("ROLLBACK");

        if (error.code === "23505") {
            const duplicateError = new Error("Already interacted with this user");
            duplicateError.code = "INTERACTION_ALREADY_EXISTS";
            throw duplicateError;
        }
        throw error;

    } finally {
        client.release();
    }
}