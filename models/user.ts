import mongoose from "mongoose";
import { IUser } from "../types/common";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Student", "Teacher"],
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  quizzes: {
    pending: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    completed: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Quiz",
        },
        score: Number,
      },
    ],
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
