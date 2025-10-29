import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongooseUrl: process.env.MONGOOSE_URL,
  mongooseArchive: process.env.MONGOOSE_ARCHIVE,
};
