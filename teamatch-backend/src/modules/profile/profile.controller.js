const profileService = require("./profile.service");
const { updateProfileSchema } = require("./profile.validation");
const { formatZodErrors } = require("../../utils/zodErrorFormatter");

/**
 * Handle request to get the current authenticated user's profile.
 *
 * Assumes authMiddleware has already attached req.user.
 */
async function getCurrentUserProfile(req, res) {
  try {
    // req.user comes from your auth middleware
    const userId = req.user.id;

    const profile = await profileService.getCurrentUserProfile(userId);

    return res.status(200).json(profile);
  } catch (error) {
    // In real-world apps, you'd map specific errors to status codes
    return res.status(400).json({
      message: error.message,
    });
  }
}

/**
 * Handle PATCH /profile
 *
 * Updates the authenticated user's profile.
 * Accepts partial input — only provided fields will be updated.
 *
 * Requires authMiddleware to attach req.user.
 */
async function updateCurrentUserProfile(req, res) {
  try {
    const userId = req.user.id;

    // Validate request body using Zod
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedProfile = await profileService.updateCurrentUserProfile(
      userId,
      validatedData
    );

    return res.status(200).json(updatedProfile);
  } catch (error) {
    if (error.name === "ZodError") {
    return res.status(400).json({
    message: "Invalid request body",
    errors: formatZodErrors(error),
  });
}
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
};