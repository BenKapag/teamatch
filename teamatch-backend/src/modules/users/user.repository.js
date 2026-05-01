const { query } = require("../../db/connection");

/**
 * Maps a PostgreSQL user row to the internal user entity shape
 * used by the application layer.
 *
 * @param {Object} row
 * @returns {Object|null}
 */
function mapRowToUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

/**
 * Finds a user by ID.
 *
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function findById(id) {
  const result = await query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return mapRowToUser(result.rows[0]);
}

/**
 * Finds a user by email.
 *
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function findByEmail(email) {
  const result = await query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return mapRowToUser(result.rows[0]);
}

/**
 * Finds a user by username (case-insensitive).
 *
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
async function findByUsername(username) {
  const result = await query(
    "SELECT * FROM users WHERE LOWER(username) = $1",
    [username]
  );

  return mapRowToUser(result.rows[0]);
}

/**
 * Create a new user.
 *
 * @param {{ email: string, username: string, passwordHash: string, createdAt: string }} userData
 * @param {{ query: Function }} [client] - Optional database client used for transactions.
 * @returns {Promise<object>} The created user row.
 */
async function create(userData, client) {
  // Use the transaction client when provided.
  // Otherwise, fall back to the default query function for normal single-query usage.
  const db = client || { query };

  const sql = `
    INSERT INTO users (email, username, password_hash, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    userData.email,
    userData.username,
    userData.passwordHash,
    userData.createdAt,
  ];

  const result = await db.query(sql, values);
  return mapRowToUser(result.rows[0]);
}

module.exports = {
  findById,
  findByEmail,
  findByUsername,
  create,
};