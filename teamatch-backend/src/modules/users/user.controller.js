const userService = require("./user.service");

/**
 * Handles user creation requests.
 *
 * Responsibilities:
 * - read request input
 * - perform basic request validation
 * - call the service layer
 * - translate service outcomes into HTTP responses
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
async function createUser(req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      error: "email, username, and password are required",
    });
  }

  try {
    const createdUser = await userService.createUser({
      email,
      username,
      password,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    if (error.message === "email already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }

    if (error.message === "username already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "internal server error",
    });
  }
}

/**
 * Handles requests to retrieve a user by ID.
 *
 * Responsibilities:
 * - read route parameters
 * - validate request-level input
 * - call the service layer
 * - return the appropriate HTTP response
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
async function getUserById(req, res) {
  const userId = Number(req.params.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      error: "user id must be a valid number",
    });
  }

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "internal server error",
    });
  }
}

module.exports = {
  createUser,
  getUserById,
};