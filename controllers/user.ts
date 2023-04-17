import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ExpressError from "../utils/ExpressError";
import User from "../models/user";
import Post from "../models/post";
import Chat from "../models/chat";
import { RequestAuth } from "../types/User";
import { Server } from "socket.io";
interface Message {
  room: string;
  text: string;
  author: string;
  time: Date;
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, username, password, email, type } = req.body;

  const exsitUsername = await User.findOne({ username });
  if (exsitUsername)
    return next(new ExpressError("Username already in use", 400));
  const existEmail = await User.findOne({ email });
  if (existEmail) return next(new ExpressError("Email already in use", 400));

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ fullname, username, password: hash, email, type });
  const userID = user._id;

  user.save();

  const token = jwt.sign({ userID }, process.env.SECRET as string, {
    expiresIn: "3d",
  });

  res.json({ username, token });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user)
    return next(new ExpressError("Incorrect username or password", 400));
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return next(new ExpressError("Incorrect username or password", 400));

  const userID = user._id;

  const token = jwt.sign({ userID }, process.env.SECRET as string, {
    expiresIn: "3d",
  });

  res.json({
    _id: userID,
    fullname: user.fullname,
    avatar: user.avatar.path,
    username,
    type: user.type,
    token,
  });
};

export const edit = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const { fullname, email } = req.body;

  const existEmail = await User.findOne({ email });
  if (existEmail && existEmail?.username !== req.user.username)
    return next(new ExpressError("Email already in use", 400));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullname, email },
    { new: true }
  );
  res.json(user);
};

export const uploadAvatar = async (req: RequestAuth, res: Response) => {
  const user = await User.findById(req.user._id);
  user!.avatar.filename = (req.files! as any)[0].filename;
  user!.avatar.path = (req.files! as any)[0].path;
  await user!.save();
  res.json((req.files! as any)[0]);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .populate("rooms")
    .populate("quizzes.pending");
  res.json(user);
};

export const getUserPost = async (req: Request, res: Response) => {
  const posts = await Post.find({ author: req.params.id })
    .populate("author")
    .populate("room");
  res.json(posts);
};

export const getAllRooms = async (req: RequestAuth, res: Response) => {
  const chats = await Chat.find({
    members: { $in: [req.user._id] },
    messages: { $not: { $size: 0 } },
  }).populate("members");

  res.json(chats);
};

export const getChatRoom = async (req: Request, res: Response) => {
  const { id, user } = req.body;
  const room1 = await Chat.findOne({
    members: [id, user],
  });
  const room2 = await Chat.findOne({
    members: [user, id],
  });

  if (room1) return res.json(room1);
  if (room2) return res.json(room2);

  const chat = new Chat({ members: [id, user] });
  await chat.save();
  res.json(chat);
};

export const profileSockets = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("send-direct-message", async (data: Message) => {
      const room = await Chat.findById(data.room);
      const body = {
        text: data.text,
        author: data.author,
        time: new Date(Date.now()),
      };
      room!.messages.push(body);
      await room?.save();
      io.emit(`receive-message-${data.room}`, room?.messages);
    });
  });
};
