"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("http://localhost:3000/workspaces", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">
            Workspaces
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-zinc-400 text-lg">
            Loading workspaces...
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold">
              No Workspaces Found
            </h2>

            <p className="text-zinc-400 mt-2">
              There are no workspaces available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-400 transition"
              >
                <h2 className="text-xl font-semibold text-emerald-400 mb-2">
                  {workspace.name}
                </h2>

                <p className="text-zinc-400 mb-6">
                  Workspace ID: {workspace.id}
                </p>

                <Link
                  href={`/dashboard/workspaces/${workspace.id}/clients`}
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
                >
                  View Clients
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}