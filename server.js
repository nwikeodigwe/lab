const app = require("./app");
const mongoose = require("mongoose");
const { logger } = require("./utils/Logger.js");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info(`Connected to MongoDB...`);
  });
  logger.info(`Listening on port ${port}...`);
});
