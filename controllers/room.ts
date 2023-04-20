import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import { RequestAuth } from "../types/User";
import { IRoom } from "../types/Room";
import ExpressError from "../utils/ExpressError";
import { Server } from "socket.io";
import Room from "../models/room";
import Post from "../models/post";
import User from "../models/user";
import Chat from "../models/chat";

interface RoomsPoPulate extends Document {
  type: "Teacher" | "Student";
  rooms: IRoom[];
  quizzes: {
    pending: mongoose.Types.ObjectId[];
    completed: mongoose.Types.ObjectId[];
  };
}

interface Message {
  room: string;
  text: string;
  author: string;
}

export const getAll = async (req: RequestAuth, res: Response) => {
  const user = await User.findById(req.user._id).populate({
    path: "rooms",
    populate: {
      path: "teachers",
    },
  });
  res.json(user?.rooms);
};

export const getOne = async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id)
    .populate("teachers")
    .populate("students")
    .populate("pending");
  res.json(room);
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({ room: req.params.id })
    .populate("room")
    .populate("author");
  res.json(posts);
};

export const create = async (req: RequestAuth, res: Response) => {
  const room = new Room(req.body);
  const user = await User.findById(req.user._id);
  room.teachers.push(user!._id);
  user?.rooms.push(room._id);

  const chat = new Chat();
  chat.members.push(user?._id);
  room.chat = chat._id;

  await room.save();
  await user?.save();
  await chat.save();
  res.json(room);
};

export const join = async (req: RequestAuth, res: Response) => {
  const { code } = req.body;

  if (!code) return;
  const codeExist = await Room.findOne({ code });
  if (!codeExist) throw new ExpressError("Invalid code", 400);

  const user = await User.findById<RoomsPoPulate>(req.user._id).populate(
    "rooms"
  );
  const foundRoom = await Room.findOne({ code }).populate("pending");

  const pending = foundRoom!.pending.find(
    (p: any) => p.username === req.user.username
  );
  if (pending) throw new ExpressError("You are already in pending list", 400);
  const joined = user!.rooms.find((room) => room.code === code);
  if (joined)
    throw new ExpressError("You are already member of this room", 400);

  const room = await Room.findOne({ code });
  room?.pending.push(user!._id);

  await room?.save();
  await user?.save();
  res.json(room);
};

export const reject = async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id)
    .populate("pending")
    .populate("teachers")
    .populate("students");
  const pending = room!.pending.filter((student) => student._id != req.body.id);
  room!.pending! = pending;
  await room?.save();
  res.json(room);
};

export const accept = async (req: Request, res: Response) => {
  const { id } = req.body;
  const { id: roomId } = req.params;

  const room = await Room.findById(roomId).populate("quizzes");
  const user = await User.findById<RoomsPoPulate>(req.body.id);
  if (!room) return new ExpressError("No room", 400);
  if (!user) return new ExpressError("No user", 400);

  user.rooms.push(roomId as any);

  const pending = room.pending.filter((student) => student._id != id);
  room.pending = pending;

  if (user.type === "Teacher") {
    room.teachers.push(id);
  } else {
    room.students.push(id);
  }

  for (let quiz of room.quizzes) {
    user.quizzes.pending.push(quiz._id);
  }

  const chat = await Chat.findById(room.chat);
  chat?.members.push(id);

  await room.save();
  await user.save();
  await chat?.save();

  const updatedRoom = await Room.findById(roomId)
    .populate("pending")
    .populate("students")
    .populate("teachers");

  res.json(updatedRoom);
};

export const leave = async (req: RequestAuth, res: Response) => {
  const user = await User.findById(req.user._id).populate({
    path: "rooms",
    populate: {
      path: "teachers",
    },
  });
  if (!user) return new ExpressError("No user", 400);

  const room = await Room.findById(req.params.id).populate("students");
  const newRoom = room!.students.filter(
    (user) => user.username !== req.user.username
  );
  room!.students = newRoom;
  room!.save();

  const rooms = user.rooms.filter((room) => (room._id as any) != req.params.id);

  const chat = await Chat.findById(room?.chat);
  if (chat) {
    const members = chat.members.filter((member) => member._id !== user._id);
    chat.members = members;
    chat.save();
  }

  user.rooms = rooms;
  user.save();
  res.json(user.rooms);
};

export const links = async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);
  room!.link = req.body;
  await room?.save();
  res.json(room?.link);
};

export const chat = async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id)
    .populate("teachers")
    .populate("students");
  const chat = await Chat.findById(room?.chat)
    .populate("members")
    .populate("messages");

  res.json({ chat, room });
};

export const sockets = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
      socket.join(data);
    });

    socket.on("send_message", async (data: Message) => {
      const room = await Chat.findById(data.room);
      const body = {
        text: data.text,
        author: data.author,
        time: new Date(Date.now()),
      };
      room!.messages.push(body);
      room?.save();
      socket.to(data.room).emit("receive_message", room?.messages);
    });
  });
};
