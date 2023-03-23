export interface IQuiz {
  readonly _id: mongoose.Types.ObjectId;
  title: string;
  due: string;
  quizzes: Array<{
    question: string;
    choices: Array<{ answer: string; isCorrect: boolean }>;
  }>;
  author: mongoose.Types.ObjectId;
}
