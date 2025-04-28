"use client";
import { Button } from "@/components/ui/button";
import { useProtectedSession } from "../hooks/useProtectedSession";
import { toast } from "sonner";
import { useSessionStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Mock blog data type
interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
}

export default function Home() {
  const { session, isHydrated } = useProtectedSession();
  const router = useRouter();
  const { clearSession } = useSessionStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/post", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setBlogs(data.blogs);
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

  const handleCreateBlog = () => {
    router.push("/blogs/create");
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/blogs/${blogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Delete failed");
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
            <Button onClick={handleCreateBlog}>Create Blog</Button>
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
              <p className="text-sm text-gray-500">By {blog.author}</p>

              {session.role === "admin" && (
                <div className="mt-4 space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteBlog(blog.id)}
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
