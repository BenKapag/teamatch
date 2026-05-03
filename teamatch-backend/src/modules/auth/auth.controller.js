const authService = require("./auth.service");
const {registerSchema, loginSchema} = require("./auth.validation");
const { formatZodErrors } = require("../../utils/zodErrorFormatter"); 
const { ZodError } = require("zod");

/**
 * Handle user registration requests.
 */
async function registerUser(req, res) {

  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    const user = await authService.registerUser(validatedData);

    return res.status(201).json(user);
  } catch (error) {
    //Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: formatZodErrors(error),
      });
    }
    //Business logic errors
    if (
      error.message === "email already exists" ||
      error.message === "username already exists"
    ) {
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
 * Handle user login requests.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
async function loginUser(req, res) {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await authService.loginUser(validatedData);

    return res.status(200).json({
      message: "login successful",
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: formatZodErrors(error),
      });
    }

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
  registerUser,
};