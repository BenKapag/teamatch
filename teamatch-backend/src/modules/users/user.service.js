/**
 * In-memory storage for users.
 *
 * This acts as a temporary data store while the application is running.
 * In later stages, this will be replaced by a repository layer backed by PostgreSQL.
 */
const users = [];

let nextUserId = 1;

/**
 * Mock password hashing function.
 *
 * Important:
 * This is NOT secure and exists only for development purposes.
 * In a real system, we would use a library like bcrypt or argon2.
 *
 * @param {string} password
 * @returns {string} hashed password
 */
function hashPassword(password) {
  return `hashed_${password}`;
}

/**
 * Converts an internal user object into a public-safe representation.
 *
 * Why this exists:
 * The internal user object contains sensitive data (passwordHash),
 * which must never be exposed in API responses.
 *
 * @param {Object} user
 * @returns {Object} public user object
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
 * Creates a new user and stores it in memory.
 *
 * Business rules:
 * - email must be unique
 * - username must be unique
 * - password is stored only as a hash (never plain text)
 * - createdAt timestamp is generated at creation time
 *
 * @param {Object} input
 * @param {string} input.email
 * @param {string} input.username
 * @param {string} input.password
 *
 * @returns {Object} public user object (without passwordHash)
 *
 * @throws {Error} if email or username already exists
 */
function createUser({ email, username, password }) {
  // Normalize input for consistent uniqueness checks
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  // Check for existing email
  const existingEmailUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (existingEmailUser) {
    throw new Error("email already exists");
  }

  // Check for existing username
  const existingUsernameUser = users.find(
    (user) => user.username.toLowerCase() === normalizedUsername
  );

  if (existingUsernameUser) {
    throw new Error("username already exists");
  }

  // Build the internal user object
  const newUser = {
    id: nextUserId++,
    email: normalizedEmail,
    username: username.trim(), // preserve original casing for display
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Return a safe version of the user (without sensitive fields)
  return toPublicUser(newUser);
}

/**
 * Finds a user by numeric id.
 *
 * @param {number} userId
 * @returns {Object|null} public user object or null if not found
 */
function getUserById(userId) {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

module.exports = {
  createUser,
  getUserById,
};