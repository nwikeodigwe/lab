import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { logger } from "./utils/Logger.js";
import routes from "./startup/routes.js";
import prod from "./startup/prod.js";
const app = express();

routes(app);
prod(app);

export default app;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info(`Connected to MongoDB...`);
  });
  logger.info(`Listening on port ${port}...`);
});
