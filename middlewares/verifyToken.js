import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { ERROR } from "../utils/statusText.js";

const { verify } = jwt;

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    return next(new AppError(401, ERROR, "Token is required"));
  }

  try {
    const currentUser = verify(authHeader, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return next(new AppError(401, ERROR, "Invalid Token"));
  }
};

export default verifyToken;
