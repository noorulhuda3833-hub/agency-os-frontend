"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import AuthGuard from "../../../components/AuthGuard";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    setLoading(true);
    setError("");

    const response = await api("/workspaces");

    if (response.ok) {
      setWorkspaces(response.data || []);
    } else {
      setError(
        response.data?.errors?.join(", ") ||
          response.data?.error ||
          "Failed to load workspaces."
      );
    }

    setLoading(false);
  }

  async function handleCreateWorkspace(event) {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name) {
      setError("Workspace name is required.");
      return;
    }

    setCreating(true);
    setError("");

    const response = await api("/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setWorkspaces((currentWorkspaces) => [
        ...currentWorkspaces,
        response.data,
      ]);

      setWorkspaceName("");
    } else {
      setError(
        response.data?.errors?.join(", ") ||
          response.data?.error ||
          "Failed to create workspace."
      );
    }

    setCreating(false);
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-primary p-8 text-text">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-wider text-accent">
            Management
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Workspaces
          </h1>

          <p className="mt-2 text-muted">
            Manage your workspaces and access their clients.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-border/30 bg-surface p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Add New Workspace
          </h2>

          <form
            onSubmit={handleCreateWorkspace}
            className="flex flex-col gap-4 md:flex-row"
          >
            <input
              type="text"
              value={workspaceName}
              onChange={(event) =>
                setWorkspaceName(event.target.value)
              }
              placeholder="Enter workspace name"
              required
              className="
                flex-1 rounded-xl border border-border/50
                bg-primary px-4 py-3 text-text
                outline-none focus:border-accent
              "
            />

            <button
              type="submit"
              disabled={creating}
              className="
                rounded-xl bg-accent px-6 py-3
                font-medium text-white transition
                hover:brightness-110
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {creating ? "Creating..." : "Add Workspace"}
            </button>
          </form>
        </section>

        <section className="mb-8 rounded-2xl border border-border/30 bg-surface p-6 shadow-md">
          <p className="text-sm text-muted">
            Total Workspaces
          </p>

          <p className="mt-2 text-3xl font-bold text-accent">
            {workspaces.length}
          </p>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  animate-pulse rounded-2xl
                  border border-border/30
                  bg-surface p-6
                "
              >
                <div className="mb-5 h-6 w-1/2 rounded bg-primary" />
                <div className="mb-8 h-4 w-1/3 rounded bg-primary" />
                <div className="h-10 w-36 rounded-xl bg-primary" />
              </div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="rounded-2xl border border-border/30 bg-surface p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No Workspaces Found
            </h2>

            <p className="mt-2 text-muted">
              Create your first workspace to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="
                  rounded-2xl border border-border/30
                  bg-surface p-6 shadow-md
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:border-accent
                  hover:shadow-xl
                "
              >
                <h2 className="mb-3 text-xl font-bold text-accent">
                  {workspace.name}
                </h2>

                <p className="mb-6 text-muted">
                  Workspace #{workspace.id}
                </p>

                <Link
                  href={`/dashboard/workspaces/${workspace.id}/clients`}
                  className="
                    inline-flex items-center justify-center
                    rounded-xl bg-accent px-5 py-3
                    font-medium text-white shadow-lg
                    transition hover:brightness-110
                  "
                >
                  View Clients
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}