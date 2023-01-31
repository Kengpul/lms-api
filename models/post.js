const mongoose = require("monggose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Conten cannot be blank"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
