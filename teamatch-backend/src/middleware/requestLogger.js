/**
 * Logs the HTTP method and path for every incoming request.
 */
function requestLogger(req, res, next) {
  console.log(`[${req.method}] ${req.path}`);
  next();
}

module.exports = requestLogger;