const { pool } = require("../../db/connection");
const profileRepository = require("../profile/profile.repository");
const userRepository = require("../users/user.repository");
const { toPublicUser } = require("../users/user.mapper");
const { hashPassword, comparePassword } = require("./password.service");
const { signAccessToken } = require("./token.service");

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

  // Get a dedicated database connection for the transaction
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Create the user inside the transaction
    const createdUser = await userRepository.create(newUserData, client);

    // Create the associated profile (same transaction)
    await profileRepository.createProfile(createdUser.id, client);

    // Commit both operations together
    await client.query("COMMIT");

    // Return safe public data
    return toPublicUser(createdUser);

  } catch (error) {
    // Rollback any changes if something failed
    await client.query("ROLLBACK");

    // Propagate the error to the controller
    throw error;

  } finally {
    // Always release the connection back to the pool
    client.release();
  }
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
  const publicUser = toPublicUser(user);
  const accessToken = signAccessToken(user);

  return {
  accessToken,
  user: publicUser,
  };
}


module.exports = {
  loginUser,
  registerUser,
};