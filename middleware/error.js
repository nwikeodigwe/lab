import logger from "../utils/Logger.js";
import { status } from "http-status";

export default function (err, req, res, next) {
  logger.error(err.message, err);
  return res
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ message: status[status.INTERNAL_SERVER_ERROR], data: {} });
}
