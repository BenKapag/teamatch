const express = require("express");
const router = express.Router();

const profileController = require("./profile.controller");
const {authMiddleware} = require("../auth/auth.middleware");

/**
 * GET /profile
 *
 * Returns the authenticated user's profile.
 */
router.get("/", authMiddleware, profileController.getCurrentUserProfile);

/**
 * PATCH /profile
 *
 * Partially update the authenticated user's profile.
 */
router.patch( "/", authMiddleware, profileController.updateCurrentUserProfile);

module.exports = router;