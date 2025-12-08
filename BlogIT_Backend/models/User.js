import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    userBio: {
      type: String,
      required: false
    },

    postCount: {
        type: Number,
        default: 0
      },
      likes: {
        type: Number,
        default: 0
      },
      views: {
        type: Number,
        default: 0
      },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    followNotifications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
  ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
