import { Router } from "express";
import { login, logout, me, register, verifyEmail } from "../controllers/auth";
import { isLoggedIn } from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/verify-email", verifyEmail);
authRouter.get("/me", isLoggedIn, me);
authRouter.post("/logout", logout);

export default authRouter;
