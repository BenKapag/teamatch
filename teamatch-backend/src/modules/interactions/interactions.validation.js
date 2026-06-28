const { z } = require("zod");

/**
 * Validation schema for POST /discover/:candidateId/interact.
 */

const createInteractionSchema = z.object({
    action: z.enum(['like', 'pass']),
}).strict();

module.exports = {
    createInteractionSchema,
};
