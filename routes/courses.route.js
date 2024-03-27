import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getOne,
  updateCourse,
} from "../controllers/courses.controller.js";
import { pagination, validation } from "../middlewares/validation.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import verifyToken from "../middlewares/verifyToken.js";
import roles from "../utils/roles.js";
import allowedTo from "../middlewares/allowedTo.js";

const coursesRouter = Router();

coursesRouter
  .route("/")
  .get(verifyToken, pagination(), asyncWrapper(getAllCourses))
  .post(
    verifyToken,
    allowedTo(roles.ADMIN, roles.MANAGER),
    validation(),
    asyncWrapper(addCourse)
  );

coursesRouter
  .route("/:id")
  .get(verifyToken, asyncWrapper(getOne))
  .patch(
    verifyToken,
    allowedTo(roles.ADMIN, roles.MANAGER),
    asyncWrapper(updateCourse)
  )
  .delete(verifyToken, allowedTo(roles.MANAGER), asyncWrapper(deleteCourse));

export default coursesRouter;
