import { Request, Response, NextFunction } from "express";
import { IUser, RequestAuth } from "../types/common";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError";

import User from "../models/user";
import Post from "../models/post";
import Room from "../models/room";
import {
  postSchema,
  registerSchema,
  loginSchema,
  createRoomSchema,
  roomLinkSchema,
  quizSchema,
  publishQuizSchema,
} from "../schemas";

interface JwtPayload {
  userID: string;
}

interface PopulatedAuthor {
  author: IUser;
}

export const validateContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(postSchema, req.body, next);
};
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(registerSchema, req.body, next);
};
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(loginSchema, req.body, next);
};
export const validateCreateRoom = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(createRoomSchema, req.body, next);
};
export const validateLinks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(roomLinkSchema, req.body, next);
};

export const validateQuiz = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(quizSchema, req.body, next);
};

export const validateAddQuiz = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateBody(publishQuizSchema, req.body, next);
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ExpressError("Post not found", 400);
  } else {
    next();
  }
};

export const requireAuth = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) throw new ExpressError("Unauthorized", 400);

  const token = authorization.split(" ")[1];
  const { userID } = jwt.verify(
    token,
    process.env.SECRET as string
  ) as JwtPayload;
  req.user = (await User.findOne({ _id: userID })) as IUser;

  next();
};

export const isAuthor = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const post = await Post.findById<PopulatedAuthor>(id).populate(
    "author",
    "username"
  );
  const user = await User.findById(req.user._id);
  if (post?.author.username !== user?.username) {
    throw new ExpressError("Unauthorized", 400);
  } else {
    next();
  }
};

export const isTeacher = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  if (req.user.type !== "Teacher")
    throw new ExpressError("Only teacher account can create rooms", 400);
  next();
};

export const uniqueRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const validateBody = (
  schema: { validate: (arg0: string) => { error: any } },
  body: string,
  next: NextFunction
) => {
  const { error } = schema.validate(body);
  if (error) {
    const msg = error.details
      .map((el: { message: string }) => el.message)
      .join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
