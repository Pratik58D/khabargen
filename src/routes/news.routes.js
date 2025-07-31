import express from "express";
import { authMiddleware, role } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { createNews, updateNews } from "../controllers/news.controller.js";

const newsRouter = express.Router();

newsRouter.post("/create", authMiddleware, role, upload.array("images", 5), createNews);
newsRouter.put("/update/:id", authMiddleware, role, upload.array("images", 5), updateNews);



export default newsRouter;