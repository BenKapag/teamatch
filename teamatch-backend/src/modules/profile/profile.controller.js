const profileService = require("./profile.service");

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

module.exports = {
  getCurrentUserProfile,
};