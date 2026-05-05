const express = require("express");
const discoveryController = require("./discovery.controller");
const {authMiddleware} = require("../auth/auth.middleware");

const router = express.Router();

/**
 * Get discovery candidates for the currently authenticated user
 */
router.get("/", authMiddleware, discoveryController.getDiscoveryCandidates);

module.exports = router;