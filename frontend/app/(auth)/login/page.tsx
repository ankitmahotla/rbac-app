import { LoginForm } from "@/components/login";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <LoginForm />
      <p className="mt-4">
        Don't have an account?{" "}
        <Link className="text-blue-500 underline" href="/signup">
          Signup
        </Link>
      </p>
    </>
  );
}
