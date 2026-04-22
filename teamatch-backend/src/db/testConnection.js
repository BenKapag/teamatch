const { query } = require("./connection");

async function test() {
  try {
    const result = await query("SELECT 1 AS ok;");
    console.log("DB OK:", result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  }
}

test();