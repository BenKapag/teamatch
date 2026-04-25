const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

/**
 * POST /login
 * Authenticate a user.
 */

router.post("/login", authController.loginUser);


module.exports = router;