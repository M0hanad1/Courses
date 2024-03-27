import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connect } from "mongoose";
import coursesRouter from "./routes/courses.route.js";
import { ERROR } from "./utils/statusText.js";
import usersRouter from "./routes/users.route.js";

config();

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 5000;
const dbUrl = process.env.DBURL;

connect(dbUrl).then(() => {
  console.log("MongoDB connected");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.all("*", (req, res) => {
  res.status(404).json({
    status: FAIL,
    message: "This resource is not available",
    data: null,
  });
});
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    data: null,
  });
  next();
});

app.listen(port, hostname, () => {
  console.log(`Listening to http://${hostname}:${port}`);
});
