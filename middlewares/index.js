const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

const User = require("../models/user");
const Post = require("../models/post");
const Room = require("../models/room");
const {
  postSchema,
  registerSchema,
  loginSchema,
  createRoomSchema,
} = require("../schemas");

module.exports.validateContent = (req, res, next) => {
  validateBody(postSchema, req.body, next);
};

module.exports.validateRegister = (req, res, next) => {
  validateBody(registerSchema, req.body, next);
};

module.exports.validateLogin = (req, res, next) => {
  validateBody(loginSchema, req.body, next);
};

module.exports.validateCreateRoom = (req, res, next) => {
  validateBody(createRoomSchema, req.body, next);
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

module.exports.uniqueRoom = async (req, res, next) => {
  const { name, code } = req.body;

  const nameExist = await Room.findOne({ name });
  if (nameExist) {
    throw new ExpressError("Name already in used", 400);
  }
  const codeExist = await Room.findOne({ code });
  if (codeExist) {
    throw new ExpressError("Code Already in used", 400);
  }

  next();
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
