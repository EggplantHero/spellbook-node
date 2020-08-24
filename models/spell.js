const mongoose = require("mongoose");
const Joi = require("joi");
const {schoolSchema} = require("./school");

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
    type: Number,
    required: true,
    min: 0,
  },
  castTime: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Spell = mongoose.model("Spell", spellSchema);

function validateSpell(spell) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    schoolId: Joi.objectId().required(),
    range: Joi.number().min(0).required(),
    castTime: Joi.number().min(0).required(),
  };
  return Joi.validate(spell, schema);
}

exports.spellSchema = spellSchema;
exports.Spell = Spell;
exports.validate = validateSpell;
