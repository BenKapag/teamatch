const authService = require("./auth.service");

/**
 * Handle user login requests.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }

  try {
    const user = await authService.loginUser({ email, password });

    return res.status(200).json({
      message: "login successful",
      user,
    });
  } catch (error) {
    if (error.message === "invalid email or password") {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "internal server error",
    });
  }
}

module.exports = {
  loginUser,
};