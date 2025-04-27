import { Router } from "express";
import { registerUser, verifyEmail } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
