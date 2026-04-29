const jwt = require("jsonwebtoken");
const config = require("../../config");
const userRepository = require("../users/user.repository");
const { toPublicUser } = require("../users/user.mapper");

/**
 * Authenticate requests using a JWT access token.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void | import("express").Response>}
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "authorization header missing",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        error: "invalid authorization format",
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, config.auth.jwtSecret);

    const user = await userRepository.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        error: "invalid or expired token",
      });
    }

    req.user = toPublicUser(user);

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "invalid or expired token",
    });
  }
}

module.exports = {
  authMiddleware,
};