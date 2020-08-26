const mongoose = require("mongoose");
const Joi = require("joi");
const { schoolSchema } = require("./school");

const spellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  school: {
    type: schoolSchema,
    required: true,
  },
  range: {
    type: String,
    required: true,
    minlength: 0,
  },
  castTime: {
    type: String,
    required: true,
    minlength: 0,
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 9,
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 5000,
  },
  feet: {
    type: Number,
    min: 0,
  },
  minutes: {
    type: Number,
    min: 0,
  },
});

const Spell = mongoose.model("Spell", spellSchema);

function validateSpell(spell) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    schoolId: Joi.objectId().required(),
    range: Joi.string().min(0).required(),
    castTime: Joi.string().min(0).required(),
    level: Joi.number().min(0).max(9).required(),
    description: Joi.string().empty("").min(0).max(5000),
    feet: Joi.number().min(0).empty(0),
    minutes: Joi.number().min(0).empty(0),
  };
  return Joi.validate(spell, schema);
}

exports.spellSchema = spellSchema;
exports.Spell = Spell;
exports.validate = validateSpell;
