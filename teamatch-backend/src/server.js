//Starts the server and tells it which port to listen on

// Load environment variables from .env
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

/**
 * Start the HTTP server.
 */
app.listen(PORT, () => {
  console.log(`Teamatch backend running on port ${PORT}`);
});