const { Spell, validate } = require("../models/spell.js");
const { School } = require("../models/school.js");
const { User } = require("../models/user.js");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const spells = currentUser.spells;

  res.send(spells);
});

router.get("/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const spells = currentUser.spells;
  const spell = spells.find((s) => s.id === req.params.id);
  // const spell = await Spell.findById(req.params.id);
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
    castTime: req.body.castTime,
  });

  const currentUser = await User.findById(req.user._id);
  currentUser.spells.push(spell);
  currentUser.save();
  res.send(spell);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const school = await School.findById(req.body.schoolId);
  if (!school) return res.status(400).send("Invalid school.");

  const currentUser = await User.findById(req.user._id);
  const { spells } = currentUser;
  const spell = currentUser.spells.id(req.params.id);

  if (!spell)
    return res.status(404).send("The spell with the given ID was not found.");

  let index = spells.indexOf(spell);

  if (index !== -1) {
    spells[index] = {
      name: req.body.name,
      school: { _id: school._id, name: school.name },
      range: req.body.range,
      castTime: req.body.castTime,
    };
  }

  currentUser.save();

  res.send(spell);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const spell = currentUser.spells.id(req.params.id);
  spell.remove();
  currentUser.save();

  if (!spell)
    return res.status(404).send("The spell with the given ID was not found.");

  res.send(spell);
});

module.exports = router;
