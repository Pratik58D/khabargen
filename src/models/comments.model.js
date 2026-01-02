import mongoose from "mongoose";

// guest only comment

const commentSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewsArticle",
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim :true,
    lowercase: true,

  },
  commentText: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;