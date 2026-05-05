const discoveryService = require("./discovery.service");

/**
 * Handle request for discovery candidates.
 *
 * The authenticated user is attached to req.user by authMiddleware.
 */
async function getDiscoveryCandidates(req, res) {
  try {
    const candidates = await discoveryService.getDiscoveryCandidates(req.user.id);

    return res.status(200).json({
      candidates,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        message: error.message,
        missingFields: error.missingFields,
      });
    }

    if (error.statusCode === 404) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getDiscoveryCandidates,
};