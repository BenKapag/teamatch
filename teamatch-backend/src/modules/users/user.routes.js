const express = require("express");
const {
  createUser,
  getUserById,
} = require("./user.controller");

const router = express.Router();

/**
 * POST /users
 * Creates a new user.
 */
router.post("/users", createUser);

/**
 * GET /users/:id
 * Returns a single user by id.
 */
router.get("/users/:id", getUserById);

module.exports = router;