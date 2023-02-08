const Joi = require("joi");

module.exports.postSchema = Joi.object({
  content: Joi.string().required(),
});