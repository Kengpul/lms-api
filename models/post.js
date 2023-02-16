const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    // likes: [   like move to sprint 3
    //   {
    //     name: String,
    //   },
    // ],

    comments: [
      {
        // name: String,
        content: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
