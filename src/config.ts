import * as dotenv from "dotenv";

let path;

dotenv.config({path: `${__dirname}/../src/.env`})


export default {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL
}