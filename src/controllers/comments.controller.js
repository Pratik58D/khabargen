import CommentModel from "../models/comments.model.js";
import newsModel from "../models/news.model.js";

// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { newsId, username, userEmail, commentText } = req.body;

    // Validate
    if (!newsId || !username || !userEmail || !commentText) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if news exists
    const newsExists = await newsModel.findById(newsId);
    if (!newsExists) {
      return res.status(404).json({ message: "News not found" });
    }
    const comment = await CommentModel.create({
      newsId,
      username,
      userEmail,
      commentText,
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment", error: error.message });
  }
}


//updateCommnet

export const updateComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    if(!commentText){
      return res.status(400).json({ message: "please ,fill the field" });

    }

    const updated = await CommentModel.findByIdAndUpdate(
      req.params.id,
      { commentText },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ success: true, comment: updated });

  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error: error.message });
  }
};


// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const deleted = await CommentModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};