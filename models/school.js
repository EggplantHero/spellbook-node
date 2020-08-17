const mongoose = require("mongoose");
const Joi = require("joi");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const School = mongoose.model("School", schoolSchema);

function validateSchool(school) {
  const schema = { name: Joi.string().min(5).max(50).required() };
  return Joi.validate(school, schema);
}

exports.schoolSchema = schoolSchema;
exports.School = School;
exports.validate = validateSchool;
