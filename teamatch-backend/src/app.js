//Builds the Express application itself
const express = require("express"); //store the express library in variable
const healthRouter = require("./modules/health/health.routes");
const userRouter = require("./modules/users/user.routes");
const authRouter = require("./modules/auth/auth.routes");
const profileRouter = require("./modules/profile/profile.routes");
const discoveryRouter = require("./modules/discovery/discovery.routes");
const gamesRouter = require("./modules/games/games.routes");
const userGamesRouter = require("./modules/userGames/userGames.routes");
const interactionRouter = require("./modules/interactions/interactions.routes");
const requestLogger = require("./middleware/requestLogger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");



const app = express();

// Logs every incoming request. 
app.use(requestLogger);

/**
 * Built-in middleware that parses incoming JSON request bodies.
 * We add it early because most real APIs work with JSON.
 */
app.use(express.json());

// Serves Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register application routes.
app.use(healthRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/discover", discoveryRouter);
app.use("/games", gamesRouter);
app.use("/me/games", userGamesRouter);
app.use("/discover", interactionRouter);


module.exports = app;