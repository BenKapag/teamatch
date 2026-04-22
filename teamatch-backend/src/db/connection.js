const { Pool } = require("pg");
const config = require("../config");

/**
 * PostgreSQL connection pool.
 *
 * Uses centralized configuration from config layer.
 */
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
});

/**
 * Executes a parameterized SQL query.
 *
 * @param {string} text - SQL query text
 * @param {any[]} [params] - Query parameters
 * @returns {Promise<import("pg").QueryResult>}
 */
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};