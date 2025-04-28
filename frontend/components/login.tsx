"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginForm() {
  const setSession = useSessionStore((state) => state.setSession);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Login failed");
      }

      if (resData.success) {
        toast.success("Logged in successfully");
        setSession({
          id: resData.data.user.id,
          role: resData.data.user.role,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false); // End loading
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 sm:border sm:border-gray-100 sm:rounded-xl sm:shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create your account
        </h2>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="At least 8 characters"
                    {...field}
                    type="password"
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span>Logging In...</span>
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
