import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ExpressError from "../utils/ExpressError";
import User from "../models/user";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, type } = req.body;

  const exsitUsername = await User.findOne({ username });
  if (exsitUsername)
    return next(new ExpressError("Username already in use", 400));
  const existEmail = await User.findOne({ email });
  if (existEmail) return next(new ExpressError("Email already in use", 400));

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ username, password: hash, email, type });
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

  res.json({ username, type: user.type, token });
};
