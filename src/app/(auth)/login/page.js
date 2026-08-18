"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-surface border border-border/30 rounded-2xl shadow-xl p-10">

        <div className="text-center mb-8">

          <p className="uppercase tracking-widest text-sm text-accent">
            Welcome Back
          </p>

          <h1 className="text-4xl font-bold text-text mt-2">
            Agency OS
          </h1>

          <p className="text-muted mt-3">
            Sign in to manage your agency operations.
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

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

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
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
            "
          >
            Sign In
          </button>

        </form>

      </div>

    </div>
  );
}