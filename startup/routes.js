import { readFile } from "fs/promises";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import error from "../middleware/error.js";
import morgan from "../middleware/morgan.js";
import limiter from "../middleware/limiter.js";
import auth from "../middleware/auth.js";
import swaggerUi from "swagger-ui-express";
import authRoute from "../routes/auth.js";

const swaggerDocument = JSON.parse(
  await readFile(new URL("../docs/swagger.json", import.meta.url))
);

export default (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/doc", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(swaggerDocument));
  app.use("/api/auth", authRoute);
  app.use(auth);
  app.use(error);
  app.use(morgan);
};
