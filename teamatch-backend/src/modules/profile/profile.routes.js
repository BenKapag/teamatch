const express = require("express");
const profileController = require("./profile.controller");
const {authMiddleware} = require("../auth/auth.middleware");

const router = express.Router();

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