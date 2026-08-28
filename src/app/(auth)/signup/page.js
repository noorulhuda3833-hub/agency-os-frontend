"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { setToken, setUserName } from "@/utils/storage";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();

    setError("");

    if (!name || !email || !password || !passwordConfirmation) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api("/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (response.ok) {
        setToken(response.data.token);
        setUserName(response.data.user.name);

        router.push("/dashboard");
        return;
      }

      setError(
        response.data?.errors?.join(", ") ||
          response.data?.error ||
          "Unable to create account."
      );
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-6 py-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-white">
            A
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text">
            Agency OS
          </h1>

          <p className="mt-2 text-sm text-muted">
            Create your agency account
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-border/30 bg-surface p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text">
              Create an account
            </h2>

            <p className="mt-1 text-sm text-muted">
              Enter your information to get started.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-muted"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-muted"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-muted"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-medium text-muted"
              >
                Confirm Password
              </label>

              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-border/30 pt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-accent hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Agency OS
        </p>
      </div>
    </main>
  );
}