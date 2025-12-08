import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false
    },

    content: {
      type: String,
      required: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    image: {
      type: String,
      required: false
    },

    likes: {
      type: Number,
      default: 0
    },

    comments: {
      type: Number,
      default: 0
    },

    shares: {
      type: Number,
      default: 0
    },

    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
