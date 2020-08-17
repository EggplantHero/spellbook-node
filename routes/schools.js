const { School, validate } = require("../models/school.js");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const schools = await School.find().sort("name");
  res.send(schools);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school)
    return res.status(404).send("The school with the given ID was not found.");
  res.send(school);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let school = new School({
    name: req.body.name,
  });
  school = await school.save();
  res.send(school);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const school = await School.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!school)
    return res.status(404).send("The school with the given ID was not found.");

  res.send(school);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const school = await School.findByIdAndRemove(req.params.id);

  if (!school)
    return res.status(404).send("The school with the given ID was not found.");

  res.send(school);
});

module.exports = router;
