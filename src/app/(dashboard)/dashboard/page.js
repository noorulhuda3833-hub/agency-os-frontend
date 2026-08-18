"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-primary text-text flex">

        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-border/30 p-6">

          <h1 className="text-3xl font-bold text-accent mb-12">
            Agency OS
          </h1>

          <nav className="space-y-2">

            <Link
              href="/dashboard"
              className="
                block
                rounded-xl
                px-4
                py-3
                bg-accent
                text-white
                font-medium
              "
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/workspaces"
              className="
                block
                rounded-xl
                px-4
                py-3
                text-muted
                hover:bg-primary
                hover:text-accent
                transition
              "
            >
              Workspaces
            </Link>

            <button
              className="
                w-full
                text-left
                rounded-xl
                px-4
                py-3
                text-muted
                hover:bg-primary
                hover:text-accent
                transition
              "
            >
              Settings
            </button>

          </nav>

        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* Header */}
          <header className="flex justify-between items-center mb-10">

            <div>
<p className="uppercase tracking-[0.2em] text-xs text-accent font-semibold">
  DASHBOARD
</p>

<h2 className="mt-2 text-5xl font-bold text-white">
  Welcome Back 
</h2>

<p className="mt-3 text-muted text-lg">
  Manage your agency from one central place.
</p>              
            </div>

            <div className="flex items-center gap-4">

              <div className="bg-surface border border-border/30 px-5 py-3 rounded-xl">
                Noor
              </div>

              <button
                onClick={handleLogout}
                className="
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-red-500/40
                  text-red-300
                  hover:bg-red-600
                  hover:text-white
                  transition
                "
              >
                Logout
              </button>

            </div>

          </header>

          {/* Welcome Card */}
          <section className="bg-surface border border-border/30 rounded-2xl p-8 shadow-md">

            <p className="uppercase tracking-wider text-sm text-accent mb-2">
              Overview
            </p>

            <h3 className="text-3xl font-bold">
              Welcome to Agency OS 
            </h3>

            <p className="text-muted mt-3 max-w-2xl">
              Manage your agency workflows, clients, teams and workspaces
              from one centralized dashboard.
            </p>

          </section>

          {/* Dashboard Cards */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div
              className="
                bg-surface
                border
                border-border/30
                rounded-2xl
                p-6
                shadow-md
                hover:border-accent
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
              "
            >
              <h4 className="text-xl font-bold text-accent">
                Workspaces
              </h4>

              <p className="text-muted mt-3 mb-6">
                Create and manage all of your workspaces.
              </p>

              <Link
                href="/dashboard/workspaces"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-accent
                  px-5
                  py-3
                  text-white
                  font-medium
                  hover:brightness-110
                  transition
                "
              >
                Open Workspaces
              </Link>
            </div>

            <div
              className="
                bg-surface
                border
                border-border/30
                rounded-2xl
                p-6
                shadow-md
                hover:border-accent
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
              "
            >
              <h4 className="text-xl font-bold text-accent">
                Projects
              </h4>

              <p className="text-muted mt-3">
                Project management module will be available soon.
              </p>
            </div>

            <div
              className="
                bg-surface
                border
                border-border/30
                rounded-2xl
                p-6
                shadow-md
                hover:border-accent
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
              "
            >
              <h4 className="text-xl font-bold text-accent">
                Team
              </h4>

              <p className="text-muted mt-3">
                Team collaboration features are coming soon.
              </p>
            </div>

          </section>

        </main>

      </div>
    </AuthGuard>
  );
}