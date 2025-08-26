const morgan = require("morgan");
const { info } = require("../utils/Logger");

module.exports = morgan("combined", {
  stream: {
    write: (message) => info(message.trim()),
  },
});
