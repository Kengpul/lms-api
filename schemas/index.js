const Joi = require("joi");

module.exports.postSchema = Joi.object({
  content: Joi.string().required(),
  likes: Joi.array().items({
    name: Joi.string().required(),
    date: Joi.date().required(),
  }),
  comments: Joi.array().items({
    name: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required(),
  }),
});

module.exports.registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  type: Joi.string().valid("Student").valid("Teacher").required(),
});

module.exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
