//Builds the Express application itself
const express = require("express"); //store the express library in variable
const healthRouter = require("./modules/health/health.routes");
const userRouter = require("./modules/users/user.routes");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Logs every incoming request. 
app.use(requestLogger)

/**
 * Built-in middleware that parses incoming JSON request bodies.
 * We add it early because most real APIs work with JSON.
 */
app.use(express.json());

// Register application routes.
app.use(healthRouter);
app.use(userRouter);

module.exports = app;