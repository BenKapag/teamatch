const userRepository = require("./user.repository");
const { toPublicUser } = require("./user.mapper");

/**
 * Temporary password hashing for development.
 * Replace with bcrypt or argon2 before production use.
 *
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  return `hashed_${password}`;
}


/**
 * Retrieves a user by ID.
 *
 * @param {number} userId
 * @returns {Promise<{ id: number, email: string, username: string, createdAt: string } | null>}
 */
async function getUserById(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

module.exports = {
  getUserById,
};