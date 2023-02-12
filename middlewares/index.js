const { isValidObjectId } = require("mongoose");
const { postSchema, registerSchema, loginSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

module.exports.validateContent = (req, res, next) => {
  validateBody(postSchema, req.body, next);
};

module.exports.validateRegister = (req, res, next) => {
  validateBody(registerSchema, req.body, next);
};

module.exports.validateLogin = (req, res, next) => {
  validateBody(loginSchema, req.body, next);
};

module.exports.validateId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ExpressError("Post not found", 400);
  } else {
    next();
  }
};

const validateBody = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
