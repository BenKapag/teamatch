/**
 * In-memory storage for users.
 * This is temporary and exists only while the server is running.
 * Later, PostgreSQL will replace this.
 */
const users = [];

let nextUserId = 1;

/**
 * Creates a new user and stores it in memory.
 *
 * @param {Object} userData - The incoming user data.
 * @param {string} userData.username - The username of the new user.
 * @param {string} userData.email - The email of the new user.
 * @returns {Object} The created user object.
 */
function createUser(userData) {
  const newUser = {
    id: nextUserId,
    username: userData.username,
    email: userData.email,
  };

  users.push(newUser);
  nextUserId += 1;

  return newUser;
}

/**
 * Finds a user by numeric id.
 *
 * @param {number} userId - The id of the user to find.
 * @returns {Object|undefined} The matching user, or undefined if not found.
 */
function getUserById(userId) {
  return users.find((user) => user.id === userId);
}

module.exports = {
  createUser,
  getUserById,
};