const userRepository = require("../users/user.repository");
const { toPublicUser } = require("../users/user.mapper");

/**
 * Authenticate user with email and password.
 * Returns a public-safe user object on success.
 *
 * Uses a generic error message to avoid leaking which credential failed.
 *
 * @param {{ email: string, password: string }} input
 * @returns {Promise<{ id: number, email: string, username: string, createdAt: string }>}
 * @throws {Error} if credentials are invalid
 */
async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throw new Error("invalid email or password");
  }

  // Temporary hashing — replace with bcrypt later
  const passwordMatches = `hashed_${password}` === user.passwordHash;

  if (!passwordMatches) {
    throw new Error("invalid email or password");
  }

  return toPublicUser(user);
}

module.exports = {
  loginUser,
};