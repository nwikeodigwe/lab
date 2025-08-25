import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import Auth from "../models/auth.js";
import { status } from "http-status";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);
  let auth = new Auth({
    email: req.body.email,
    password: password,
  });

  const user = await Auth.findOne({ email: req.body.email });

  if (user) {
    return res.status(status.CONFLICT).json({
      message: "User already exists",
    });
  }

  auth = await auth.save();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: _.pick(auth, ["id", "email", "createdAt"]),
    },
    process.env.JWT_PRIVATE_KEY
  );

  return res
    .status(status.CREATED)
    .json({ message: status[status.CREATED], token });
});

router.post("/signin", async (req, res) => {
  let auth = new Auth();
  auth.email = req.body.email;
  auth.password = req.body.password;

  let user = await Auth.findOne({ email: auth.email });

  if (!user)
    return res.status(status.NOT_FOUND).json({
      message: status[status.NOT_FOUND],
      description: "Invalid credentials",
    });

  const password = await bcrypt.compare(auth.password, user.password);

  if (!password)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Invalid credentials",
    });

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: _.pick(user, ["id", "email", "createdAt"]),
    },
    process.env.JWT_PRIVATE_KEY
  );

  return res.status(status.OK).json({ message: status[status.OK], token });
});

router.post("/reset", async (req, res) => {
  let user = await Auth.findOne({ email: req.body.email });

  if (!user)
    return res.status(status.NOT_FOUND).json({
      message: status[status.NOT_FOUND],
      description: "Invalid request",
    });

  user.reset.token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: _.pick(user, ["id", "email"]),
    },
    process.env.JWT_PRIVATE_KEY
  );

  await user.save();

  return res.status(status.OK).end();
});

router.post("/reset/:token", async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_PRIVATE_KEY);

  if (!decoded)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Invalid request",
    });

  const user = await Auth.findOne({ "reset.token": req.params.token });
  if (!user) {
    return res.status(status.NOT_FOUND).json({
      message: status[status.NOT_FOUND],
      description: "Invalid request",
    });
  }

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: _.pick(user, ["id", "email", "createdAt"]),
    },
    process.env.JWT_PRIVATE_KEY
  );

  return res
    .status(status.OK)
    .json({ message: status[status.OK], data: token });
});

export default router;
