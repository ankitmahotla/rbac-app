import { SignupForm } from "@/components/sign-up";
import Link from "next/link";

export default function Signup() {
  return (
    <>
      <SignupForm />
      <p className="mt-4">
        Already have an account?{" "}
        <Link className="text-blue-500 underline" href="/login">
          Login
        </Link>
      </p>
    </>
  );
}
