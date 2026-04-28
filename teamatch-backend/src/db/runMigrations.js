const fs = require("fs");
const path = require("path");
const { query } = require("./connection");

/**
 * Executes all SQL migration files found in the migrations directory.
 *
 * - Reads .sql files from the migrations folder
 * - Executes them in sorted order (based on filename)
 * - Intended for initial schema setup and incremental DB changes
 *
 * Note:
 * This is a simple migration runner and does not track executed migrations.
 */
async function runMigrations() {
  try {
    // Resolve absolute path to the migrations directory
    const migrationsDir = path.join(__dirname, "../../migrations");

    // Read all files, keep only .sql files, and sort them to enforce execution order
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Execute each migration file sequentially
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);

      // Read SQL content from file
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);

      // Execute SQL against the database
      await query(sql);
    }

    console.log("Migrations completed successfully");

    // Exit process with success code
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);

    // Exit process with failure code
    process.exit(1);
  }
}

// Run migrations when script is executed
runMigrations();