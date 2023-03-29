import mongoose from "mongoose";
import { IPost } from "../types/Post";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        username: String,
        date: Date,
      },
    ],
    comments: [
      {
        fullname: String,
        content: String,
        date: Date,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
