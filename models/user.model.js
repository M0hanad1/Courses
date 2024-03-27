import { model, Schema } from "mongoose";
import validator from "validator";
import roles from "../utils/roles.js";

const { isEmail } = validator;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: "Field must be a valid Email",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(roles),
    default: roles.USER,
  },
  token: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);
export default User;
