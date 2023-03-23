import { Request, Response } from "express";
import { RequestAuth } from "../types/User";
import Post from "../models/post";
import User from "../models/user";
import Room from "../models/room";
interface MulterRequest extends Request {
  files: any;
}

export const index = async (req: Request, res: Response) => {
  const posts = await Post.find({})
    .populate("author")
    .populate("room")
    .sort({ createdAt: "desc" });
  res.json(posts);
};

export const create = async (req: RequestAuth, res: Response) => {
  const { content, rooms } = req.body;

  for (let roomId of rooms) {
    const post = new Post({ content });
    const room = await Room.findById(roomId.value);

    post.author = req.user._id;
    room?.posts.push(room._id);
    post.room = roomId.value;

    await room?.save();
    post.save();

    res.json(post);
  }
};

export const getRooms = async (req: RequestAuth, res: Response) => {
  const rooms = await User.findById(req.user._id).populate("rooms");
  res.json(rooms);
};

export const getOne = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id).populate("room");
  res.json(post);
};

export const edit = async (req: Request, res: Response) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(post);
};

export const destroy = async (req: Request, res: Response) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  res.json(post);
};

export const like = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id)
    .populate("room")
    .populate("author");
  const liked = post?.likes.find((like) => like.username === req.body.content);
  if (!liked) {
    post!.likes.push({
      username: req.body.content,
      date: new Date(Date.now()),
    });
  } else {
    const likes = post!.likes.filter((like) => like !== liked);
    post!.likes = likes;
  }
  post?.save();
  res.json(post);
};

export const comment = async (req: RequestAuth, res: Response) => {
  const post = await Post.findById(req.params.id);
  post?.comments.push({
    ...req.body,
    username: req.user.username,
    date: Date.now(),
  });
  post?.save();
  res.json(post);
};

export const uploadImage = async (req: MulterRequest, res: Response) => {
  const path = req.files[0].path;
  res.json(path);
};
