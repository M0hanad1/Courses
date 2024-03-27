import { Router } from "express";
import {
  getAllUsers,
  login,
  register,
} from "../controllers/users.controller.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { pagination } from "../middlewares/validation.js";
import verifyToken from "../middlewares/verifyToken.js";
import allowedTo from "../middlewares/allowedTo.js";
import roles from "../utils/roles.js";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(
    verifyToken,
    allowedTo(roles.ADMIN, roles.MANAGER),
    pagination(),
    asyncWrapper(getAllUsers)
  );
usersRouter.route("/register").post(asyncWrapper(register));
usersRouter.route("/login").post(asyncWrapper(login));

export default usersRouter;
