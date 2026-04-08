//Starts the server and tells it which port to listen on
const app = require("./app");

const PORT = 3000;

/**
 * Start the HTTP server.
 */
app.listen(PORT, () => {
  console.log(`Teamatch backend running on port ${PORT}`);
});