"use strict";

/** Express app for PharmaMate */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const homeRoute = require("./routes/home");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const activitiesRoutes = require("./routes/activitiesCalendar.js");
const journalRoutes = require("./routes/journal");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/", homeRoute);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/users", activitiesRoutes);
app.use("/users", journalRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
