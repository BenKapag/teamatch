const express = require("express");
const interactionController = require("./interactions.controller");
const {authMiddleware} = require("../auth/auth.middleware");


const router = express.Router();

/**
 * POST /discover/:candidateId/interact
 * 
 * Creates interaction between two autenticated users.  
 */

router.post("/:candidateId/interact", authMiddleware, interactionController.interactWithUser);

module.exports = router;

