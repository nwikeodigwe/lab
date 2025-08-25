import express from "express";
import helmet from "helmet";
import cors from "cors";
import error from "../middleware/error";
import morgan from "../middleware/morgan";
import auth from "../middleware/auth";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

export default (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/doc", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(swaggerDocument));
  app.use(auth);
  app.use(error);
  app.use(morgan);
};
