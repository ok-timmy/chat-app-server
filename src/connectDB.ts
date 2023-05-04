import mongoose from "mongoose";
import config from "./config";

const connectDB =
    mongoose.connect(config.MONGODB_URL, {useNewUrlParser : true, useUnifiedTopology : true})
.then(
    console.log('connected to my database')
    return;
).catch((err) => console.log(err));
