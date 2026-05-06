const fs = require("fs");
const path = require("path");
const { query } = require("./connection");

/**
 * Executes all SQL seed files found in the seeds directory.
 *
 * Seeds insert initial/reference data into the database.
 * Each seed file should be safe to run multiple times, usually by using
 * ON CONFLICT DO NOTHING.
 */
async function runSeeds() {
  try {
    // Resolve absolute path to the seeds directory at the backend root.
    const seedsDir = path.join(__dirname, "../../seeds");

    // Read all .sql seed files and sort them to enforce execution order.
    const files = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Execute each seed file sequentially.
    for (const file of files) {
      const filePath = path.join(seedsDir, file);

      // Read SQL content from the seed file.
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running seed: ${file}`);

      // Execute SQL against the database.
      await query(sql);
    }

    console.log("Seeds completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeds when this script is executed.
runSeeds();