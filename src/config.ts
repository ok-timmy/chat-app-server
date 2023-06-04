import * as dotenv from "dotenv";

dotenv.config({path: `${__dirname}/../src/.env`})


export default {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    SECRET_HASH: process.env.SECRET_HASH
}