export interface IPost extends IUser {
  readonly _id: mongoose.Types.ObjectId;
  content: string;
  likes: ILike[];
  comments: IComment[];
  author: mongoose.Types.ObjectId | IUser;
  room: IRoom;
  createdAt: string;
  updatedAt: string;
}

interface ILike {
  username: string;
  date: date;
}

interface IComment {
  readonly _id: mongoose.Types.ObjectId;
  fullname: string;
  content: string;
  date: string;
}
