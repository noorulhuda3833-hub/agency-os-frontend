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
      <div className="min-h-screen bg-zinc-950 text-white flex">

        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
          <h1 className="text-2xl font-bold text-emerald-400 mb-10">
            Agency OS
          </h1>

          <nav className="space-y-5">

            <Link
              href="/dashboard"
              className="block text-emerald-400"
            >
              Dashboard
            </Link>

           <Link
  href="/dashboard/workspaces"
  className="block text-zinc-400 hover:text-emerald-400"
>
  Workspaces
</Link>

            <div className="text-zinc-400 hover:text-emerald-400 cursor-pointer">
              Settings
            </div>

          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* Navbar */}
          <header className="flex justify-between items-center mb-10">

            <div>
              <h2 className="text-3xl font-bold">
                Dashboard
              </h2>

              <p className="text-zinc-400 mt-2">
                Manage your agency operations
              </p>
            </div>

            <div className="flex items-center gap-4">

              <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg">
                Noor
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>

            </div>

          </header>

          {/* Welcome Card */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">

            <h3 className="text-2xl font-semibold mb-3">
              Welcome to Agency OS 🚀
            </h3>

            <p className="text-zinc-400">
              Manage your agency workflows, teams and workspaces from one place.
            </p>

          </section>

          {/* Dashboard Cards */}
          <section className="mt-6 grid grid-cols-3 gap-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="font-semibold">
  Workspaces
</h4>

<p className="text-zinc-400 mt-2 mb-4">
  Manage all your workspaces
</p>

<Link
  href="/dashboard/workspaces"
  className="inline-block bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
>
  Open Workspaces
</Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="font-semibold">
                Projects
              </h4>
              <p className="text-zinc-400 mt-2">
                Coming soon
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="font-semibold">
                Team
              </h4>
              <p className="text-zinc-400 mt-2">
                Coming soon
              </p>
            </div>

          </section>

        </main>

      </div>
    </AuthGuard>
  );
}