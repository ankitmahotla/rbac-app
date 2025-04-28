"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "idle"
  >(token ? "loading" : "idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/auth/verify-email?token=${token}`,
        );
        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Email verfied!, Redirecting....");
          setStatus("success");
          setMessage("Your email has been verified! You may now log in.");
          router.replace("/login");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred. Please try again later.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p className="text-green-600">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
      {status === "idle" && <p>Invalid verification link.</p>}
    </div>
  );
}
