"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/workspaces/1/clients",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">
          Clients
        </h1>

        {loading ? (
          <div className="text-center text-zinc-400 text-lg">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold">
              No Clients Found
            </h2>

            <p className="text-zinc-400 mt-2">
              There are no clients available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-400 transition"
              >
                <h2 className="text-xl font-semibold text-emerald-400 mb-4">
                  {client.name}
                </h2>

                <div className="space-y-2 text-zinc-300">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {client.email}
                  </p>

                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {client.phone}
                  </p>

                  <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {client.company}
                  </p>

                  <p>
                    <span className="font-semibold">Workspace ID:</span>{" "}
                    {client.workspace_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}