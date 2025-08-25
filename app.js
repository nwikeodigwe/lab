import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { logger } from "./utils/Logger.js";
const app = express();

// import "./auth/passport";
import "./startup/routes.js";
import "./startup/prod";

export default app;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info(`Connected to MongoDB...`);
  });
  logger.info(`Listening on port ${port}...`);
});
