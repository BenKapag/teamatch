const express = require("express");

const router = express.Router();

/**
 * GET /health
 * Basic health-check endpoint to verify that the service is running.
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

module.exports = router;