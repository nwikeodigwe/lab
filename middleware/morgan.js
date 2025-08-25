import morgan from "morgan";
import { info } from "../utils/Logger";

export default morgan("combined", {
  stream: {
    write: (message) => info(message.trim()),
  },
});
