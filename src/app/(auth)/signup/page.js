"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
localStorage.setItem("userName", data.user.name);

router.push("/dashboard");
      } else {
        setError(data.errors?.join(", ") || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface border border-border/30 rounded-2xl shadow-xl p-10">

        <div className="text-center mb-8">
          <p className="uppercase tracking-widest text-sm text-accent">
            Create Account
          </p>

          <h1 className="text-4xl font-bold text-text mt-2">
            Agency OS
          </h1>

          <p className="text-muted mt-3">
            Create your account to continue.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">

          <div>
            <label className="block text-sm text-muted mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-primary
                border
                border-border/40
                text-text
                placeholder:text-muted
                focus:outline-none
                focus:border-accent
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-primary
                border
                border-border/40
                text-text
                placeholder:text-muted
                focus:outline-none
                focus:border-accent
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-primary
                border
                border-border/40
                text-text
                placeholder:text-muted
                focus:outline-none
                focus:border-accent
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-primary
                border
                border-border/40
                text-text
                placeholder:text-muted
                focus:outline-none
                focus:border-accent
                transition
              "
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-accent
              text-white
              font-semibold
              hover:brightness-110
              transition
              shadow-lg
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-muted text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:underline"
            >
              Sign In
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}