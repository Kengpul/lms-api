const Post = require("../models/post");

module.exports.index = async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
};

module.exports.create = async (req, res) => {
  const post = new Post(req.body);
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

module.exports.comment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push(req.body);
  post.save();
  res.json(post);
};

module.exports.uploadImage = async (req, res) => {
  const path = req.files[0].path;
  res.json(path);
};
