import "dotenv/config";
import express from "express";
import { logger } from "./utils/Logger.js";
const app = express();

// import "./auth/passport";
import "./startup/routes";
// import "./startup/prod";

export default app;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});
