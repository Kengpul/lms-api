const { isValidObjectId } = require("mongoose");
const { postSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

module.exports.validateContent = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ExpressError("Post not found", 400);
  } else {
    next();
  }
};
