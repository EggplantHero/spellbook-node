const mongoose = require("mongoose");
const Joi = require("joi");
const schoolSchema = require("./school");

const spellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
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
});

const Spell = mongoose.model("Spell", spellSchema);

function validateSpell(spell) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    schoolId: Joi.objectId().required(),
    range: Joi.number().min(0).required(),
  };
  return Joi.validate(spell, schema);
}

exports.Spell = Spell;
exports.validate = validateSpell;