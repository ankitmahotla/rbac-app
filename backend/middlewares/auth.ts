import asyncHandler from "../utils/async-handler";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserJwtPayload } from "../types/auth";
import { ApiError } from "../utils/api-error";

export const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, "Authentication failed");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserJwtPayload;

    req.user = decoded;
    next();
  },
);
