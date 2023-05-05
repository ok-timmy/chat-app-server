import mongoose from "mongoose";
import config from "./config";

export const connectDB = async()=> {
  await  mongoose.connect(config.MONGODB_URL)
  console.log("DB connected successfully!")

}