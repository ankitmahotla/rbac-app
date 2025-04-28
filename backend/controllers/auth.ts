import { PrismaClient } from "../generated/prisma";
import asyncHandler from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { randomBytes } from "crypto";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }, // Only check for existence
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await Bun.password.hash(password);
  const verificationToken = randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      verificationToken: true, // Needed for email sending
    },
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${user.verificationToken}`;

  await sendEmail({
    email: user.email,
    subject: "Verify Your Email",
    mailgenContent: emailVerificationMailgenContent(user.name, verificationUrl),
  });

  // Remove verificationToken from response
  const { verificationToken: _, ...sanitizedUser } = user;

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        sanitizedUser,
        "User registered successfully. Verification email sent.",
      ),
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token as string,
      verificationTokenExpiry: { gt: new Date() },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Email verified"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      // Added select here
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await Bun.password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  // Remove password from response
  const { password: _, ...sanitizedUser } = user;

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(200, { user: sanitizedUser, token }, "Login successful"),
    );
});

export const me = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details retrieved"));
});

export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json(new ApiResponse(200, null, "Logged out successfully"));
});
