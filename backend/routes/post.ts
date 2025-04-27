import { Router } from "express";
import { allPosts, createPost, deletePost } from "../controllers/post";
import { isAdmin } from "../middlewares/post";
import { isLoggedIn } from "../middlewares/auth";

const postRouter = Router();

postRouter.get("/", isLoggedIn, allPosts);
postRouter.post("/create", isAdmin, createPost);
postRouter.delete("/delete/:id", isAdmin, deletePost);

export default postRouter;
