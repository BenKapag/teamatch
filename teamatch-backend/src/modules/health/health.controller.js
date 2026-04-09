/**
 * Health check controller.
 * Returns a simple response that confirms the service is running.
 */
function getHealth(req, res) {
  res.status(200).json({
    status: "ok",
  });
}

module.exports = {
  getHealth,
};