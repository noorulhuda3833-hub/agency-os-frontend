"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import AuthGuard from "../../../../../components/AuthGuard";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [errors, setErrors] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  const dialogRef = useRef(null);

  const { workspaceId } = useParams();

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/workspaces/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setWorkspace(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/workspaces/${workspaceId}/clients`,
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace();
      fetchClients();
    }
  }, [workspaceId]);

  const openModal = () => {
    setEditingClient(null);
    setForm(emptyForm);
    setErrors([]);
    dialogRef.current.showModal();
  };

  const editClient = (client) => {
    setEditingClient(client);

    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
    });

    setErrors([]);
    dialogRef.current.showModal();
  };

  const closeModal = () => {
    dialogRef.current.close();
    setForm(emptyForm);
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    try {
      const url = editingClient
        ? `http://localhost:3000/workspaces/${workspaceId}/clients/${editingClient.id}`
        : `http://localhost:3000/workspaces/${workspaceId}/clients`;

      const method = editingClient ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || ["Something went wrong"]);
        return;
      }

      closeModal();
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteClient = async (clientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    const previousClients = clients;

    setClients((current) =>
      current.filter((client) => client.id !== clientId)
    );

    try {
      const response = await fetch(
        `http://localhost:3000/workspaces/${workspaceId}/clients/${clientId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      setClients(previousClients);
      alert("Failed to delete client.");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-primary text-text px-10 py-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <p className="text-sm uppercase tracking-wider text-accent">
              Management
            </p>

            <h1 className="text-3xl font-bold text-text mt-1">
              Clients
            </h1>

            <p className="text-muted mt-2">
              Manage clients in {workspace?.name || "this workspace"}.
            </p>
          </div>

          <button
            onClick={openModal}
            className="bg-accent hover:brightness-110 transition-all duration-200 px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg text-text"
          >
            + Add Client
          </button>

        </div>

        <div className="mb-8 bg-surface border border-border/30 rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-muted">
            Total Clients
          </p>

          <p className="text-3xl font-bold text-accent mt-2">
            {clients.length}
          </p>
        </div>

        <ClientForm
          dialogRef={dialogRef}
          editingClient={editingClient}
          errors={errors}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-surface border border-border/30 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-primary rounded w-1/2 mb-6"></div>

                <div className="space-y-3">
                  <div className="h-4 bg-primary rounded w-3/4"></div>
                  <div className="h-4 bg-primary rounded w-2/3"></div>
                  <div className="h-4 bg-primary rounded w-1/2"></div>
                </div>

                <div className="flex gap-3 mt-6">
                  <div className="h-9 bg-primary rounded-lg w-20"></div>
                  <div className="h-9 bg-primary rounded-lg w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-surface border border-border/30 rounded-2xl p-10 text-center shadow-lg">
            <h2 className="text-2xl font-semibold text-text">
              No clients yet
            </h2>

            <p className="text-muted mt-3">
              Create your first client to start managing customer information.
            </p>
          </div>
        ) : (
          <ClientList
            clients={clients}
            editClient={editClient}
            deleteClient={deleteClient}
          />
        )}

      </div>
    </AuthGuard>
  );
}