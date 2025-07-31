import express from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { authMiddleware, isSuperAdmin } from "../middleware/auth.middleware.js";


const userRouter = express.Router()

userRouter.post("/signup",authMiddleware , isSuperAdmin,registerUser);


userRouter.post("/login",loginUser);
userRouter.post("/logout",logout);


export default userRouter;