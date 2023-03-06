import { Response } from "express";
import { RequestAuth } from "../types/common";
import Quiz from "../models/quiz";

export const create = (req: RequestAuth, res: Response) => {
  const quiz = new Quiz(req.body);
  quiz.author = req.user._id;
  quiz.save();
  res.json(quiz);
};
