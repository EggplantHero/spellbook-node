const { Spell, validate } = require("../models/spell.js");
const { School } = require("../models/school.js");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const spells = await Spell.find().sort("name");
  res.send(spells);
});

router.get("/:id", async (req, res) => {
  const spell = await Spell.findById(req.params.id);
  if (!spell)
    return res.status(404).send("The spell with the given ID was not found.");
  res.send(spell);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const school = await School.findById(req.body.schoolId);
  if (!school) return res.status(400).send("Invalid school.");

  let spell = new Spell({
    name: req.body.name,
    school: {
      _id: school._id,
      name: school.name,
    },
    range: req.body.range,
  });
  spell = await spell.save();
  res.send(spell);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const school = await School.findById(req.body.schoolId);
  if (!school) return res.status(400).send("Invalid school.");

  const spell = await Spell.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, school: { _id: school._id, name: school.name } },
    { new: true }
  );

  if (!spell)
    return res.status(404).send("The spell with the given ID was not found.");

  res.send(spell);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const spell = await Spell.findByIdAndRemove(req.params.id);

  if (!spell)
    return res.status(404).send("The spell with the given ID was not found.");

  res.send(spell);
});

module.exports = router;
