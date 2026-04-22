/**
 * In-memory storage for users.
 *
 * This repository currently uses a simple array as its data source.
 * Later, this implementation will be replaced by PostgreSQL without
 * requiring major changes in the service layer.
 */
const users = [];

let nextUserId = 1;

/**
 * Finds a user by numeric ID.
 *
 * @param {number} userId - The user ID to search for.
 * @returns {Object|null} The matching internal user object, or null if not found.
 */
function findById(userId) {
  const user = users.find((user) => user.id === userId);

  return user || null;
}

/**
 * Finds a user by normalized email.
 *
 * Important:
 * The service layer is responsible for normalizing email values before
 * calling the repository, so this function expects a normalized input.
 *
 * @param {string} email - Normalized email address.
 * @returns {Object|null} The matching internal user object, or null if not found.
 */
function findByEmail(email) {
  const user = users.find((user) => user.email === email);

  return user || null;
}

/**
 * Finds a user by normalized username.
 *
 * Important:
 * The service layer is responsible for normalizing username values before
 * calling the repository, so this function expects a normalized input.
 *
 * @param {string} username - Normalized username value used for uniqueness checks.
 * @returns {Object|null} The matching internal user object, or null if not found.
 */
function findByUsername(username) {
  const user = users.find(
    (user) => user.username.trim().toLowerCase() === username
  );

  return user || null;
}

/**
 * Creates a new user in the repository.
 *
 * The repository is responsible only for persistence concerns.
 * It receives a fully prepared internal user payload from the service layer,
 * assigns an ID, stores it, and returns the stored entity.
 *
 * @param {Object} userData - Prepared internal user data.
 * @param {string} userData.email - Normalized email address.
 * @param {string} userData.username - Display username.
 * @param {string} userData.passwordHash - Hashed password.
 * @param {string} userData.createdAt - ISO timestamp of user creation.
 * @returns {Object} The stored internal user object.
 */
function create(userData) {
  const newUser = {
    id: nextUserId++,
    email: userData.email,
    username: userData.username,
    passwordHash: userData.passwordHash,
    createdAt: userData.createdAt,
  };

  users.push(newUser);

  return newUser;
}

module.exports = {
  findById,
  findByEmail,
  findByUsername,
  create,
};