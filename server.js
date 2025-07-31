import express from "express";
import dotenv from "dotenv";
import db_connect from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cloudinary from "./src/config/cloudinary.js";
import newsRouter from "./src/routes/news.routes.js";
import categoryRouter from "./src/routes/category.routes.js";

dotenv.config();

const app = express();
const Port = process.env.port;

cloudinary;

app.use(express.json())
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send("testing the newsportal")
})


//Routing
app.use("/api",userRouter);
app.use("api/create" , newsRouter)
app.use("/api/category",categoryRouter)



app.listen(Port , ()=>{
    console.log(`server is running at ${Port}`);
    db_connect();
})