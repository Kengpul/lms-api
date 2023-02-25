const mongoose = require("mongoose");
const { Schema } = mongoose;

const userObject = [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
];

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  teachers: userObject,
  students: userObject,
  pending: userObject,
  link: {
    attendance: {
      type: String,
      default: "",
    },
    meeting: {
      type: String,
      default: "",
    },
  },
});

module.exports = mongoose.model("Room", roomSchema);
