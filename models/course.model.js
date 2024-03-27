import { model, Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  videos: {
    type: Number,
    required: true,
  },
});

const Course = model("Course", courseSchema);
export default Course;
