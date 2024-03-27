import { validationResult } from "express-validator";
import Course from "../models/course.model.js";
import { ERROR, FAIL, SUCCESS } from "../utils/statusText.js";
import AppError from "../utils/appError.js";

export const getAllCourses = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(400, FAIL, errors.array()));
  }

  const query = req.query;
  const limit = +query.limit || 10;
  const page = +query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).skip(skip).limit(limit);
  res.json({ status: SUCCESS, data: { courses, limit, page, skip } });
};

export const getOne = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError(404, FAIL, "Course is not found"));
  }

  res.json({ status: SUCCESS, data: { course } });
};

export const addCourse = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(400, FAIL, errors.array()));
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: SUCCESS, data: { course: newCourse } });
};

export const updateCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );

    if (!newCourse) {
      return next(new AppError(404, FAIL, "Course in not found"));
    }

    res.json({ status: SUCCESS, data: { course: newCourse } });
  } catch (err) {
    return res
      .status(400)
      .json({ status: ERROR, message: err.message, code: 400, data: null });
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const data = await Course.deleteOne({ _id: req.params.id });

    if (!data.deletedCount) {
      return next(new AppError(404, FAIL, "Course in not found"));
    }

    res.json({ status: SUCCESS, data: data });
  } catch (err) {
    return res
      .status(400)
      .json({ status: ERROR, message: err.message, code: 400, data: null });
  }
};
