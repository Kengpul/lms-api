import { Request, Response } from "express";
import { RequestAuth } from "../types/common";
import Quiz from "../models/quiz";
import User from "../models/user";
import Room from "../models/room";

export const getAll = async (req: RequestAuth, res: Response) => {
  const student = await User.findById(req.user._id).populate({
    path: "quizzes",
    populate: {
      path: "pending",
      populate: {
        path: "author",
      },
    },
  });

  const teacher = await Quiz.find({ author: req.user._id }).populate("quizzes");

  if (req.user.type === "Teacher") {
    res.json(teacher);
  } else {
    res.json(student?.quizzes.pending);
  }
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

export const submit = async (req: RequestAuth, res: Response) => {
  const user = await User.findById(req.user._id).populate({
    path: "quizzes",
    populate: {
      path: "pending",
    },
  });
  const quiz = await Quiz.findById(req.params.id);
  const quizId = quiz?._id;

  const complete = {
    _id: quizId,
    score: req.body.score,
  };

  const filtered = user!.quizzes.pending.filter(
    (q: any) => q.title != quiz!.title
  );
  user!.quizzes.pending = filtered;
  user?.quizzes.completed.push(complete as any);
  user?.save();

  res.json(req.body);
};
