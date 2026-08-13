"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">

      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-3xl font-bold mb-6 text-emerald-400">
          Agency OS
        </h1>


        <form onSubmit={handleLogin}>


          <input
            className="w-full mb-4 p-3 bg-zinc-800 rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />


          <input
            className="w-full mb-4 p-3 bg-zinc-800 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />


          {error && (
            <p className="text-red-500 mb-3">
              {error}
            </p>
          )}


          <button
            className="w-full bg-emerald-500 p-3 rounded font-bold"
          >
            Login
          </button>


        </form>

      </div>

    </div>
  );
}