const jwt = require("jsonwebtoken");
const config = require("../../config");

/**
 * Signs an access token for an authenticated user.
 *
 * @param {{ id: number, email: string }} user
 * @returns {string}
 */
function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    config.auth.jwtSecret,
    {
      expiresIn: config.auth.jwtExpiresIn,
    }
  );
}

module.exports = {
  signAccessToken,
};