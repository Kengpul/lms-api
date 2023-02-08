const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Content cannot be blank"],
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
        required: [true, "Content cannot be blank"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
