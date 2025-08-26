const logger = require("../utils/Logger.js");
const { status } = require("http-status");

module.exports = function (err, req, res, next) {
  console.log(err);
  logger.error(err.message, err);
  return res.status(status.INTERNAL_SERVER_ERROR).json({
    message: status[status.INTERNAL_SERVER_ERROR],
    error: err.message,
  });
};
