import dotenv from "dotenv";

dotenv.config();

export const config = {
  APP_PORT: process.env.APP_PORT,

  MONGO_URL: process.env.MONGO_URL,
};
