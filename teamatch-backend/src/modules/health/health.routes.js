const express = require("express");
const { getHealth } = require("./health.controller");

const router = express.Router();

/**
 * GET /health
 * Basic health-check endpoint.
 */
router.get("/health", getHealth);

module.exports = router;