const userService = require("./user.service");

/**
 * Creates a new user from the request body.
 */
function createUser(req, res) {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      error: "username and email are required",
    });
  }

  const createdUser = userService.createUser({ username, email });

  return res.status(201).json(createdUser);
}

/**
 * Returns a user by id.
 */
function getUserById(req, res) {
  const userId = Number(req.params.id);

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