const mongoose = require("mongoose");
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
        username: String,
        content: String,
        date: Date,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
