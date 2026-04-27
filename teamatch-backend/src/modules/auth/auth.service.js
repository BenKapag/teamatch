const userRepository = require("../users/user.repository");
const { toPublicUser } = require("../users/user.mapper");
const { hashPassword, comparePassword } = require("./password.service");

/**
 * Register a new user.
 *
 * @param {{ email: string, username: string, password: string }} input
 * @returns {Promise<{ id: number, email: string, username: string, createdAt: string }>}
 */
async function registerUser({ email, username, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  // Check email uniqueness
  const existingEmailUser = await userRepository.findByEmail(normalizedEmail);
  if (existingEmailUser) {
    throw new Error("email already exists");
  }

  // Check username uniqueness
  const existingUsernameUser =
    await userRepository.findByUsername(normalizedUsername);
  if (existingUsernameUser) {
    throw new Error("username already exists");
  }
  // Hash password before storing it
  const passwordHash = await hashPassword(password);

  const newUserData = {
    email: normalizedEmail,
    username: username.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const createdUser = await userRepository.create(newUserData);

  return toPublicUser(createdUser);
}

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

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new Error("invalid email or password");
  }

  return toPublicUser(user);
}


module.exports = {
  loginUser,
  registerUser,
};