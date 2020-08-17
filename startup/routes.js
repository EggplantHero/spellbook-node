const express = require("express");
const error = require("../middleware/error");
const schools = require("../routes/schools");
const spells = require("../routes/spells");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/schools", schools);
  app.use("/api/spells", spells);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
