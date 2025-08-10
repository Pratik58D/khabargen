import mongoose from "mongoose";

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  images: {
    type: [String],        // array of image URLs
    default: [],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  count: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Text index for search
newsArticleSchema.index({
  title: "text",
  description: "text",
}, {
  weights: {
    title: 5,
    description: 4,
  },
});

const newsModel = mongoose.model("NewsArticle", newsArticleSchema);
export default newsModel;
