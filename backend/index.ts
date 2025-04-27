import express, { type ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
const port = process.env.PORT ?? 8000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hi from RBAC backend",
  });
});

app.use("/api/v1/auth", authRouter);
app.use(errorHandler as ErrorRequestHandler);

app.listen(port, () => {
  console.log("Server running 🏃");
});
