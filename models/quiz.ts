import mongoose from "mongoose";
import { Iquiz } from "../types/common";
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

const Quiz = mongoose.model<Iquiz>("Quiz", quizSchema);

export default Quiz;
