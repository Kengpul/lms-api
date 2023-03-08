import { Request } from "express";
import mongoose, { Document } from "mongoose";

export interface IPost extends IUser {
  readonly _id: mongoose.Types.ObjectId;
  content: string;
  likes: ILike[];
  comments: IComment[];
  author: mongoose.Types.ObjectId | IUser;
  room: IRoom;
  createdAt: string;
  updatedAt: string;
}

interface ILike {
  username: string;
  date: date;
}

interface IComment {
  readonly _id: mongoose.Types.ObjectId;
  username: string;
  content: string;
  date: string;
}

export interface IRoom {
  readonly _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  posts: mongoose.Types.ObjectId[];
  teachers: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  pending: mongoose.Types.ObjectId[];
  link: {
    attendance: string;
    meeting: string;
  };
  quizzes: mongoose.Types.ObjectId[];
}

export interface IOptions {
  value: string;
  label: string;
}

export interface IUser {
  readonly _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  type: AccountType;
  rooms: mongoose.Types.ObjectId[];
}

export interface RequestAuth extends Request {
  user: IUser;
}

export interface Iquiz {
  readonly _id: mongoose.Types.ObjectId;
  title: string;
  due: string;
  quizzes: Array<{
    question: string;
    choices: Array<{ answer: string; isCorrect: boolean }>;
  }>;
  author: mongoose.Types.ObjectId;
}
