import { PrismaClient } from "../generated/prisma";
import asyncHandler from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { randomBytes } from "crypto";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail";

const prisma = new PrismaClient();

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new ApiError(400, "Missing required fields");
  }

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Hash password
  const hashedPassword = await Bun.password.hash(password);
  const verificationToken = randomBytes(32).toString("hex");

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiry
    },
  });

  const verificationUrl = `${process.env.CLIENT_URL}/api/v1/auth/verify-email?token=${verificationToken}`;

  await sendEmail({
    email: user.email,
    subject: "Verify Your Email",
    mailgenContent: emailVerificationMailgenContent(user.name, verificationUrl),
  });

  // Return sanitized user
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

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

// controllers/auth.ts
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  // 1. Find user with valid token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token as string,
      verificationTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // 2. Update user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  // 3. Return sanitized user
  const sanitizedUser = {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isVerified: updatedUser.isVerified,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, sanitizedUser, "Email verified"));
});
