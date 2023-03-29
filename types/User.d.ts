import { Request } from "express";

export interface IUser {
  readonly _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  avatar: {
    filename: string;
    path: string;
  };
  type: AccountType;
  rooms: mongoose.Types.ObjectId[];
  quizzes: {
    pending: mongoose.Types.ObjectId[];
    completed: mongoose.Types.ObjectId[];
  };
}

export interface RequestAuth extends Request {
  user: IUser;
}
