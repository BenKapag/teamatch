const interactionService = require("./interactions.service");
const { createInteractionSchema } = require("./interactions.validation");
const { formatZodErrors } = require("../../utils/zodErrorFormatter");

/**
 * Handles POST /discover/:candidateId/interact
 * Records a like or pass interaction with a discovery candidate.
 * Automatically creates a match if both users liked each other.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function interactWithUser(req, res) {
    try {
        // req.user comes from your auth middleware
        const fromUserId = req.user.id;

        // Comes from the request parameters
        const toUserId = Number(req.params.candidateId);

        if (!Number.isInteger(toUserId) || toUserId <= 0) {
            return res.status(400).json({ message: "candidateId must be a positive integer" });
        }

        if (toUserId === fromUserId) {
            return res.status(400).json({ message: "Cannot interact with yourself" });
        }

        // Validate request body using Zod
        const validatedData = createInteractionSchema.parse(req.body);

        const interaction = await interactionService.interactWithUser(fromUserId, toUserId, validatedData.action);

        return res.status(200).json(interaction)
    }

    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Invalid request body",
                errors: formatZodErrors(error),
            });
        }

        if (error.code === "INTERACTION_ALREADY_EXISTS") {
            return res.status(409).json({
                message: error.message
            });
        }
        return res.status(500).json({
            message: error.message,
        });
    }

}

module.exports = {
    interactWithUser,
}