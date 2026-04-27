const express = require("express");
const usersController = require("./user.controller");

const router = express.Router();


/**
 * GET /users/:id
 * Returns a single user by id.
 */
router.get("/users/:id", usersController.getUserById);

module.exports = router;