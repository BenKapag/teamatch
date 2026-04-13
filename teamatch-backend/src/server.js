//Starts the server and tells it which port to listen on
const app = require("./app");
const config = require("./config");

/**
 * Start the HTTP server.
 */
app.listen(config.port, () => {
  console.log(`Teamatch backend running on port ${config.port}`);
});