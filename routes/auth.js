import express from "express";
import User from "../models/User.js";
import { status } from "http-status";

const router = express.Router();

router.post("/signup", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Email and password is required",
    });

  let user = new User();
  user.email = req.body.email;
  user.password = req.body.password;

  let userExits = await user.find();

  if (userExits)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "User already exists",
    });

  await user.save();
  await user.mail(mailconf.welcome);

  const login = await user.login();

  return res
    .status(status.CREATED)
    .json({ message: status[status.CREATED], login });
});

router.post("/signin", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Email and password is required",
    });

  let user = new User();
  user.email = req.body.email;
  user.password = req.body.password;

  let userExists = await user.find();

  if (!userExists)
    return res.status(status.NOT_FOUND).json({
      message: status[status.NOT_FOUND],
      description: "Invalid credentials",
    });

  const passwordMatch = await user.passwordMatch();

  if (!passwordMatch)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Invalid credentials",
    });

  const login = await user.login();

  return res.status(status.OK).json({ message: status[status.OK], login });
});

router.post("/reset", async (req, res) => {
  if (!req.body.email)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Email is required",
    });

  let user = new User();
  user.email = req.body.email;
  let userExits = await user.find();

  if (!userExits)
    return res.status(status.NOT_FOUND).json({
      message: status[status.NOT_FOUND],
      description: "Invalid request",
    });

  await user.createResetToken();

  return res.status(status.OK).end();
});

router.post("/reset/:token", async (req, res) => {
  if (!req.params.token || !req.body.password)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Invalid request",
    });

  let user = new User();
  user.resetToken = req.params.token;

  const isValidResetToken = await user.isValidResetToken();

  if (!isValidResetToken)
    return res.status(status.BAD_REQUEST).json({
      message: status[status.BAD_REQUEST],
      description: "Invalid request",
    });

  user.password = req.body.password;
  user.id = isValidResetToken.user.id;

  await user.save();

  login = await user.login();

  return res
    .status(status.OK)
    .json({ message: status[status.OK], data: login });
});

export default router;
