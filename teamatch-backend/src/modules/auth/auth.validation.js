const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
}).strict();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict();

module.exports = {
  registerSchema,
  loginSchema,
};