import { body, query } from "express-validator";

export const validation = () => [
  body("title").notEmpty().isLength({ min: 4, max: 50 }),
  body("price").notEmpty().isNumeric(),
  body("videos").notEmpty().isNumeric(),
];

export const pagination = () => [
  query("limit").isNumeric().optional({ values: "falsy" }),
  query("page").isNumeric().optional({ values: "falsy" }),
];
