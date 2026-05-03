/**
 * Format Zod validation errors into a clean API-friendly structure.
 *
 * @param {import("zod").ZodError} error - Zod validation error.
 * @returns {{ field: string, message: string }[]} Formatted validation errors.
 */
function formatZodErrors(error) {
  return error.issues.map((issue) => {
    // Handle unknown keys error
    if (issue.code === "unrecognized_keys") {
      return {
        field: issue.keys.join(", "),
        message: "Unrecognized field(s)",
      };
    }

    return {
      field: issue.path.join("."),
      message: issue.message,
    };
  });
}

module.exports = {
  formatZodErrors,
};