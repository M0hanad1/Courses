import AppError from "../utils/appError.js";
import { ERROR } from "../utils/statusText.js";

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(new AppError(401, ERROR, "This role is not authorized"));
    }
    next();
  };
};

export default allowedTo;
