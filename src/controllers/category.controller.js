import slugify from "slugify";
import Category from "../models/category.model.js"


// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const slug = slugify(name, { lower: true, strict: true });   
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json({ success: true, data : category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};


// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};


// Get single category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
};



//searching and sorting categories
export const searchCategories = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {};

  // serching with resect to name and slug
    if (search) {
      const regex = new RegExp(search, "i"); 
      query.$or = [{ name: regex }, { slug: regex }];
    }

    //sorting alphabetically
    const categories = await Category.find(query); 

    res.json({ success: true, data : categories });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};