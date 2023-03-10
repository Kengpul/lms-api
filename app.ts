if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import express, { Request, Response, NextFunction } from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js";

import postRoute from "./routes/post";
import userRoute from "./routes/user";
import roomRoute from "./routes/room";
import quizRoute from "./routes/quiz";

const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/lms2";
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/post", postRoute);
app.use("/connect", userRoute);
app.use("/room", roomRoute);
app.use("/quiz", quizRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

interface Error {
  statusCode: number;
  message: string;
}

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Something went wrong";
  res.status(statusCode).json({ error });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
