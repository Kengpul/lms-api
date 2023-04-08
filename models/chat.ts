import mongoose from "mongoose";
import { Chat } from "../types/Chat";
const { Schema } = mongoose;

const chatSchema = new Schema({
  members: [
    {
      type: String,
    },
  ],
  messages: [
    {
      text: String,
      author: String,
      time: Date,
    },
  ],
});

const Chat = mongoose.model<Chat>("Chat", chatSchema);

export default Chat;
