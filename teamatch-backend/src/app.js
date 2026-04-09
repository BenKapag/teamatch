//Builds the Express application itself
const express = require("express");
const healthRouter = require("./modules/health/health.routes");

const app = express();

/**
 * Built-in middleware that parses incoming JSON request bodies.
 * We add it early because most real APIs work with JSON.
 */
app.use(express.json());

/**
 * Register application routes.
 */
app.use(healthRouter);

module.exports = app;