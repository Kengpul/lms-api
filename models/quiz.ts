import mongoose from "mongoose";
import { IQuiz } from "../types/common";
const { Schema } = mongoose;

const quizSchema = new Schema({
  title: String,
  due: String,
  quizzes: [
    {
      question: String,
      choices: [{ answer: String, isCorrect: Boolean }],
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);

export default Quiz;
