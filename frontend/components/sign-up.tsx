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
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        },
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      if (resData.success) {
        toast.success("Verification link sent to your mail");
        // Optional: Redirect to verification page
        // router.push('/verify-email?email=' + encodeURIComponent(data.email));
      }
    } catch (error) {
      console.error("Registration Error:", error);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your username"
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
              <span>Signing Up...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
