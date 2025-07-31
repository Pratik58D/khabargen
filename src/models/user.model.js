import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,        // don't return password by default
  },
  role: {
    type: String,
    default: "user",   
    required : false , 
    enum : ["user","admin", "superadmin"] 
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
