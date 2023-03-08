import { Request, Response } from "express";
import { IUser, RequestAuth } from "../types/common";
import Quiz from "../models/quiz";
import User from "../models/user";
import Room from "../models/room";

export const getAll = async (req: RequestAuth, res: Response) => {
  // const user = await User.findById(req.user._id);
  const quizzes = await Quiz.find().populate("author");
  res.json(quizzes);
};

export const getOne = async (req: Request, res: Response) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
};

export const create = (req: RequestAuth, res: Response) => {
  const quiz = new Quiz(req.body);
  quiz.author = req.user._id;
  quiz.save();
  res.json(quiz);
};

export const edit = async (req: Request, res: Response) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body);
  res.json(quiz);
};

export const destroy = async (req: Request, res: Response) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  res.json(quiz);
};

export const publish = async (req: Request, res: Response) => {
  const { selectedRooms, selectedQuizzes } = req.body;

  const quizzes = [];
  for (let quiz of selectedQuizzes) {
    quizzes.push(quiz.value);
  }

  for (let room of selectedRooms) {
    const foundRoom = await Room.findById(room.value).populate("students");
    foundRoom!.quizzes.push(...quizzes);
    for (let student of foundRoom!.students) {
      const user = await User.findById(student._id);
      user?.quizzes.pending.push(...quizzes);
      await user?.save();
    }
    await foundRoom!.save();
  }

  res.json(req.body);
};
