import newsModel from "../models/news.model.js";
import slugify from "slugify";
import { uploadToCloudinary } from "../utilies/imageHandling.js";

// Admin: CREATE

export const createNews = async (req, res) => {
  try {
    const { title, category, description, date } = req.body;
    const files = req.files;
    if (!title || !category || !date || !files?.length) {
      return res
        .status(400)
        .json({ message: "Missing required fields or images." });
    }
    let slug = slugify(title, { lower: true, strict: true });
    const exists = await NewsArticle.findOne({ slug });
    console.log(exists);
    if (exists) slug += "-" + Date.now();
    console.log(slug);

    const imageUrls = await uploadToCloudinary(files);
    const news = new newsModel({
      title,
      slug,
      category,
      images: imageUrls,
      description,
      date,
    });
    await news.save();
    res.status(201).json({ success: true, message: "News created", news });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//  Admin: UPDATE
export const updateNews = async (req, res) => {
  try {
    const { title, category, description, date, status } = req.body;
    const files = req.files;
    const updateFields = { title, category, description, date, status };

    if (title) {
      let slug = slugify(title, { lower: true, strict: true });
      const exists = await NewsArticle.findOne({ slug, _id: { $ne: req.params.id } });
      if (exists) slug += "-" + Date.now();
      updateFields.slug = slug;
    }

    if (files && files.length > 0) {
      const imageUrls = await uploadToCloudinary(files);
      updateFields.images = imageUrls;
    }

     const updatedNews = await NewsArticle.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    res.json({ success: true, news: updatedNews });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};