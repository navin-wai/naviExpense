require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("./routes/user");
const PORT = process.env.PORT || 8000;
const transactionRoute = require("./routes/transaction");
const mongoUrl = process.env.MONGODB_URI;
const frontEndUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");

mongoose.connect(mongoUrl).then(() => {
  console.log("Connected to mongodb");
});
app.use(
  cors({
    origin: frontEndUrl,
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRoute);
app.use("/transaction", transactionRoute);

app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});
