"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [workspaceName, setWorkspaceName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/workspaces", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: workspaceName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors?.join(", ") || "Failed to create workspace.");
        return;
      }

      // Add the newly created workspace to the list
      setWorkspaces((currentWorkspaces) => [
        ...currentWorkspaces,
        data,
      ]);

      // Clear input
      setWorkspaceName("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-primary text-text p-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <p className="text-sm uppercase tracking-wider text-accent">
              Management
            </p>

            <h1 className="text-3xl font-bold mt-1">
              Workspaces
            </h1>

            <p className="text-muted mt-2">
              Manage your workspaces and access their clients.
            </p>
          </div>

        </div>

        {/* Add New Workspace */}
        <div className="mb-8 bg-surface border border-border/30 rounded-2xl p-6 shadow-md">

          <h2 className="text-xl font-semibold mb-4">
            Add New Workspace
          </h2>

          <form
            onSubmit={handleCreateWorkspace}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="
                flex-1
                px-4
                py-3
                rounded-xl
                bg-primary
                border
                border-border/50
                text-text
                outline-none
                focus:border-accent
              "
            />

            <button
              type="submit"
              disabled={creating}
              className="
                px-6
                py-3
                rounded-xl
                bg-accent
                text-white
                font-medium
                transition
                hover:brightness-110
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {creating ? "Creating..." : "Add Workspace"}
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-sm mt-3">
              {error}
            </p>
          )}

        </div>

        {/* Total Workspaces */}
        <div className="mb-8 bg-surface border border-border/30 rounded-2xl p-6 shadow-md">
          <p className="text-sm text-muted">
            Total Workspaces
          </p>

          <p className="text-3xl font-bold text-accent mt-2">
            {workspaces.length}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-surface border border-border/30 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-zinc-800 rounded w-1/2 mb-5"></div>

                <div className="h-4 bg-zinc-800 rounded w-1/3 mb-8"></div>

                <div className="h-10 bg-zinc-800 rounded-xl w-36"></div>
              </div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-surface border border-border/30 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No Workspaces Found
            </h2>

            <p className="text-muted mt-2">
              There are no workspaces available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="
                  bg-surface
                  border
                  border-border/30
                  rounded-2xl
                  p-6
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-accent
                  hover:shadow-xl
                "
              >
                <h2 className="text-xl font-bold text-accent mb-3">
                  {workspace.name}
                </h2>

                <p className="text-muted mb-6">
                  Workspace #{workspace.id}
                </p>

                <Link
                  href={`/dashboard/workspaces/${workspace.id}/clients`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-5
                    py-3
                    rounded-xl
                    bg-accent
                    text-white
                    font-medium
                    transition
                    hover:brightness-110
                    shadow-lg
                  "
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