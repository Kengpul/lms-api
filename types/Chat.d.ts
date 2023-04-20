import { IUser } from "./User";

export interface Chat {
  readonly _id: mongoose.Types.ObjectId;
  members: IUser[];
  messages: {
    text: string;
    author: string;
    time: Date;
  }[];
}