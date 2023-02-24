if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError");

const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const roomRoute = require("./routes/room");

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

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Something went wrong";
  res.status(statusCode).json({ error });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
