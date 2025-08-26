const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const error = require("../middleware/error.js");
const morgan = require("../middleware/morgan.js");
const limiter = require("../middleware/limiter.js");
const auth = require("../middleware/auth.js");
const swaggerUi = require("swagger-ui-express");
const authRoute = require("../routes/auth.js");
const swaggerDocument = require("../docs/swagger.json");

module.exports = (app) => {
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
