const userRepository = require("./user.repository");

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
 * Maps an internal user entity to a safe API response.
 *
 * @param {Object} user
 * @param {number} user.id
 * @param {string} user.email
 * @param {string} user.username
 * @param {string} user.passwordHash
 * @param {string} user.createdAt
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

/**
 * Creates a new user.
 *
 * Business rules:
 * - email must be unique
 * - username must be unique
 * - password is stored only as a hash
 *
 * @param {{ email: string, username: string, password: string }} input
 * @returns {Promise<{ id: number, email: string, username: string, createdAt: string }>}
 * @throws {Error} If email or username already exists
 */
async function createUser({ email, username, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const existingEmailUser = await userRepository.findByEmail(normalizedEmail);

  if (existingEmailUser) {
    throw new Error("email already exists");
  }

  const existingUsernameUser =
    await userRepository.findByUsername(normalizedUsername);

  if (existingUsernameUser) {
    throw new Error("username already exists");
  }

  const newUserData = {
    email: normalizedEmail,
    username: username.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const createdUser = await userRepository.create(newUserData);

  return toPublicUser(createdUser);
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
  createUser,
  getUserById,
};