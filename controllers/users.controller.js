import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { SUCCESS, FAIL } from "../utils/statusText.js";
import AppError from "../utils/appError.js";
import { hash, compare } from "bcrypt";
import generateJWT from "../utils/generateJWT.js";

export const getAllUsers = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(400, FAIL, errors.array()));
  }

  const query = req.query;
  const limit = +query.limit || 10;
  const page = +query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find(
    {},
    { __v: false, password: false, token: false }
  )
    .skip(skip)
    .limit(limit);
  res.json({ status: SUCCESS, data: { users, limit, page, skip } });
};

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (await User.findOne({ email })) {
    return next(new AppError(400, FAIL, "User already exists"));
  }
  const hashedPassword = await hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
  });
  const token = await generateJWT({ email, id: newUser._id, role });
  newUser.token = token;
  await newUser.save();
  res.status(201).json({ status: SUCCESS, data: { user: newUser } });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await compare(password, user.password))) {
    return next(new AppError(400, FAIL, "Wrong Email or Password"));
  }
  const token = await generateJWT({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  return res.json({ status: SUCCESS, data: { token } });
};
