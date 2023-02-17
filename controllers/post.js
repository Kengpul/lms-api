const Post = require("../models/post");

module.exports.index = async (req, res) => {
  const posts = await Post.find({})
    .populate("author")
    .sort({ createdAt: "desc" });
  res.json(posts);
};

module.exports.create = async (req, res) => {
  const post = new Post(req.body);
  post.author = req.user._id;
  post.save();
  res.json(post);
};

module.exports.getOne = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
};

module.exports.edit = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(post);
};

module.exports.delete = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  res.json(post);
};

module.exports.like = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const liked = post.likes.find((like) => like.username === req.body.content);
  if (!liked) {
    post.likes.push({ username: req.body.content, date: Date.now() });
  } else {
    const likes = post.likes.filter((like) => like !== liked);
    post.likes = likes;
  }
  post.save();
  res.json(post);
};

module.exports.comment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    ...req.body,
    username: req.user.username,
    date: Date.now(),
  });
  post.save();
  res.json(post);
};

module.exports.uploadImage = async (req, res) => {
  const path = req.files[0].path;
  res.json(path);
};
