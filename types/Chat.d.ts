export interface Chat {
  readonly _id: mongoose.Types.ObjectId;
  members: string[];
  messages: {
    text: string;
    author: string;
    time: Date;
  }[];
}