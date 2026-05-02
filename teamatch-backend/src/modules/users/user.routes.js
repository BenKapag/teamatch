const express = require("express");
const usersController = require("./user.controller");
const { authMiddleware } = require("../auth/auth.middleware");

const router = express.Router();

/**
 * GET/users/me
 * Returns authenticated user identity from the jwt token
 */
router.get("/me", authMiddleware, usersController.getMe);

/**
 * GET /users/:id
 * Returns a single user by id.
 */
router.get("/:id", usersController.getUserById);

module.exports = router;