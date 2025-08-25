import morgan from "morgan";
import { logger } from "../utils/Logger.js";

export default morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});
