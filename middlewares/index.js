const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

const User = require("../models/user");
const Post = require("../models/post");
const { postSchema, registerSchema, loginSchema } = require("../schemas");

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

module.exports.requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) throw new ExpressError("Unauthorized", 400);

  const token = authorization.split(" ")[1];
  const { userID } = jwt.verify(token, process.env.SECRET);
  req.user = await User.findOne({ _id: userID });

  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("author", "username");
  const user = await User.findById(req.user._id);
  if (post.author.username !== user.username) {
    throw new ExpressError("Unauthorized", 400);
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
