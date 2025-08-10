import newsModel from "../models/news.model.js";
import slugify from "slugify";
import { extractPublicId, uploadToCloudinary } from "../utilies/imageHandling.js";
import Category from "../models/category.model.js";

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
    
   console.log(slug)
    
    const exists = await newsModel.findOne({ slug });
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
    res.status(201).json({ success: true, message: "News created",data : news });
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
      const exists = await newsModel.findOne({ slug, _id: { $ne: req.params.id } });
      if (exists) slug += "-" + Date.now();
      updateFields.slug = slug;
    };

     if (category) {
      const categoryDoc = await Category.findOne({ name: category.trim() });
      if (!categoryDoc) {
        return res.status(404).json({ message: "Category not found" });
      }
      updateFields.category = categoryDoc._id; 
    }


    if (files && files.length > 0) {
      const imageUrls = await uploadToCloudinary(files);
      updateFields.images = imageUrls;
    }

     const updatedNews = await newsModel.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    res.json({ success: true, data: updatedNews });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// admin :delete
export const deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;

    // Check if the news exists
    const news = await newsModel.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    //  Delete images from Cloudinary if stored there
    // You would need to store Cloudinary public_ids in your news.images array for this
   

    for (const imageUrl of news.images) {
      const publicId = extractPublicId(imageUrl); 
      await cloudinary.uploader.destroy(publicId);
    }

    await newsModel.findByIdAndDelete(newsId);

    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};


//public
export const getNews = async(req,res) =>{

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // const query = { status: "approved" };   // only approved news
    const query = {}

     const skip = (page - 1) * limit;

      if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { description: regex },
        {slug  :regex}
      ];
    }

     // Parallel queries: get news + total count
    const [newsList, total] = await Promise.all([
      newsModel.find(query)
        .sort({ date: -1 })          // latest news first
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .lean(),                     // plain JS objects for performance
      newsModel.countDocuments(query)
    ]);

    
    // Optionally: populate comments for each news item (just approved ones)
    // const newsWithComments = await Promise.all(newsList.map(async news => {
    //   const comments = await Comment.find({ newsId: news._id, status: "approved" }).select("username commentText createdAt").lean();
    //   return { ...news, comments };
    // }));
      res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: newsList,
    });

    
  }  catch (error) {
    res.status(500).json({ message: "Failed to get news", error: error.message });
  }

}


//  Get one news article by slug (with category and comments)
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await newsModel.findOne({ slug, status: "approved" })
      .populate("category", "name slug")
      .lean();

    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }

    // const comments = await Comment.find({ newsId: news._id, status: "approved" })
    //   .select("username commentText createdAt")
    //   .lean();

    res.json({ success: true, data: { ...news, comments } });
  } catch (error) {
    res.status(500).json({ message: "Failed to get news article", error: error.message });
  }
};
