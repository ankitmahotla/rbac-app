"use client";

import { useState, useEffect } from "react";
import { useProtectedSession } from "../hooks/useProtectedSession";
import { toast } from "sonner";
import { useSessionStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateBlog } from "@/components/dialogs/create-blog";
import { DeleteBlog } from "@/components/dialogs/delete-blog";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
}

export default function Home() {
  const { session, isHydrated } = useProtectedSession();
  const router = useRouter();
  const { clearSession } = useSessionStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/post", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setBlogs(data.data);
        } else {
          toast.error(data.message || "Failed to load blogs");
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        toast.error("Failed to load blogs");
      } finally {
        setLoadingBlogs(false);
      }
    };

    if (isHydrated) {
      fetchBlogs();
    }
  }, [isHydrated]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Logout failed");

      clearSession();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCreateBlog = async (newPost: {
    title: string;
    content: string;
  }) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create blog");

      setBlogs((prev) => [data.data, ...prev]);
      toast.success("Blog created successfully");
      return true;
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create blog",
      );
      return false;
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/delete/${blogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully");
    } catch (error) {
      throw error; // Propagate error to DeleteConfirmDialog
    }
  };

  if (!isHydrated) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Dashboard</h1>
        <div className="space-x-4">
          {session.role === "admin" && (
            <Button onClick={() => setIsDialogOpen(true)}>Create Blog</Button>
          )}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <CreateBlog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreate={handleCreateBlog}
      />

      <DeleteBlog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        blogId={blogToDelete}
        onDeleteConfirm={handleDeleteBlog}
      />

      {loadingBlogs ? (
        <div>Loading blogs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
              <p className="text-sm text-gray-500">By {blog.author.name}</p>

              {session.role === "admin" && (
                <div className="mt-4 space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setBlogToDelete(blog.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
