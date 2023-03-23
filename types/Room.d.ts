export interface IRoom {
  readonly _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  posts: mongoose.Types.ObjectId[];
  teachers: mongoose.Types.ObjectId[];
  students: IUser[];
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
