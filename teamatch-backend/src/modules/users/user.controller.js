const userService = require("./user.service");

/**
 * Handles user creation requests.
 *
 * Responsibilities of this controller:
 * - read input from the HTTP request
 * - perform basic request-level validation
 * - call the service layer for business logic
 * - translate service outcomes into HTTP responses
 */
function createUser(req, res) {
  const { email, username, password } = req.body;

  // Reject requests that do not include the required signup fields.
  if (!email || !username || !password) {
    return res.status(400).json({
      error: "email, username, and password are required",
    });
  }

  try {
    const createdUser = userService.createUser({
      email,
      username,
      password,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    // Uniqueness conflicts are business-rule failures, but the controller
    // is responsible for mapping them to the proper HTTP status code.
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

    // Any unexpected error falls back to a generic internal server error response.
    return res.status(500).json({
      error: "internal server error",
    });
  }
}

/**
 * Handles requests to retrieve a user by ID.
 *
 * Responsibilities of this controller:
 * - read the route parameter from the HTTP request
 * - validate request-level input
 * - call the service layer to fetch the user
 * - return the proper HTTP response based on the result
 */
function getUserById(req, res) {
  const userId = Number(req.params.id);

  // Route parameters arrive as strings, so we convert to a number
  // before sending the value into the service layer.
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      error: "user id must be a valid number",
    });
  }

  const user = userService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      error: "user not found",
    });
  }

  return res.status(200).json(user);
}

module.exports = {
  createUser,
  getUserById,
};