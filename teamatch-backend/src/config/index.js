// Load environment variables from .env
require("dotenv").config();

/**
 * Centralized configuration object.
 * This is the ONLY place that reads from process.env
 */
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = config;