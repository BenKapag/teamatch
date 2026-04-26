/**
 * Maps an internal user entity to a public-safe response object.
 *
 * @param {Object} user
 * @returns {{ id: number, email: string, username: string, createdAt: string }}
 */
function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

module.exports = {
  toPublicUser,
};