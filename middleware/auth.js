const Auth = require("../models/auth");
const { status } = require("http-status");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: status[status.UNAUTHORIZED], data: {} });

  let user = new User();
  let decode = user.verifyToken(token);

  if (!decode)
    return res
      .status(status.FORBIDDEN)
      .json({ message: status[status.FORBIDDEN], data: {} });

  req.user = decode;
  next();
};
