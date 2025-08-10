// routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  deleteCategory,
  searchCategories
} from "../controllers/category.controller.js";

import { authMiddleware, role } from "../middleware/auth.middleware.js";

const categoryRouter = express.Router();

// 🌍 Public routes
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/search", searchCategories);  
categoryRouter.get("/:slug", getCategoryBySlug);



// 🔐 Admin-only routes
categoryRouter.post("/", authMiddleware, role, createCategory);
categoryRouter.delete("/:id", authMiddleware, role, deleteCategory);

export default categoryRouter;
