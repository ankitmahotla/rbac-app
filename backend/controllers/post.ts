import { PrismaClient } from "../generated/prisma";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const prisma = new PrismaClient();

export const allPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (posts.length === 0) {
    throw new ApiError(404, "No posts found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched all blog posts"));
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Post ID is required");
  }

  await prisma.post
    .delete({
      where: { id },
    })
    .catch(() => {
      throw new ApiError(404, "Post not found");
    });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});
