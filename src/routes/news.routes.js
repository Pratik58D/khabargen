import express from "express";
import { authMiddleware, role } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { createNews, deleteNews, getNews, getNewsBySlug, updateNews } from "../controllers/news.controller.js";

const newsRouter = express.Router();

//admin routes

newsRouter.post("/create", authMiddleware, role, upload.array("images", 5), createNews);
newsRouter.put("/update/:id", authMiddleware, role, upload.array("images", 5), updateNews);
newsRouter.delete("/delete/:id", authMiddleware, role, deleteNews);

//pubilic routes

newsRouter.get("/",getNews);
newsRouter.get("/:slug",getNewsBySlug);

export default newsRouter;