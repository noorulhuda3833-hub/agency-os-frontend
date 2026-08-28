
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import NotesPanel from "./components/NotesPanel";
import AuthGuard from "../../../../../components/AuthGuard";
import { api } from "@/services/api";

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
  const [selectedClient, setSelectedClient] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  const dialogRef = useRef(null);
  const { workspaceId } = useParams();

  async function fetchWorkspace() {
    const response = await api("/workspaces/" + workspaceId);

    if (response.ok) {
      setWorkspace(response.data);
    }
  }

  async function fetchClients() {
    setLoading(true);

    const response = await api(
      "/workspaces/" + workspaceId + "/clients"
    );

    if (response.ok) {
      setClients(response.data || []);
    } else {
      setClients([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!workspaceId) return;

    fetchWorkspace();
    fetchClients();
  }, [workspaceId]);

  function openModal() {
    setEditingClient(null);
    setForm(emptyForm);
    setErrors([]);

    dialogRef.current?.showModal();
  }

  function editClient(client) {
    setEditingClient(client);

    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
    });

    setErrors([]);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setForm(emptyForm);
    setErrors([]);
    setEditingClient(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]);

    const path = editingClient
      ? "/workspaces/" + workspaceId + "/clients/" + editingClient.id
      : "/workspaces/" + workspaceId + "/clients";

    const method = editingClient ? "PATCH" : "POST";

    const response = await api(path, {
      method,
      body: JSON.stringify(form),
    });

    if (response.ok) {
      closeModal();
      await fetchClients();
      return;
    }

    const backendErrors =
      response.data?.errors ||
      (response.data?.error
        ? [response.data.error]
        : ["Something went wrong."]);

    setErrors(
      Array.isArray(backendErrors)
        ? backendErrors
        : [backendErrors]
    );
  }

  async function deleteClient(clientId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    const previousClients = clients;

    setClients((currentClients) =>
      currentClients.filter(
        (client) => client.id !== clientId
      )
    );

    const response = await api(
      "/workspaces/" + workspaceId + "/clients/" + clientId,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      setClients(previousClients);

      alert(
        response.data?.error ||
          "Failed to delete client."
      );
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-primary px-10 py-8 text-text">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-accent">
              Management
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Clients
            </h1>

            <p className="mt-2 text-muted">
              Manage clients in{" "}
              {workspace?.name || "this workspace"}.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="
              rounded-xl bg-accent px-5 py-2
              font-semibold text-white
              shadow-md transition
              hover:brightness-110 hover:shadow-lg
            "
          >
            + Add Client
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-border/30 bg-surface p-6 shadow-lg">
          <p className="text-sm text-muted">
            Total Clients
          </p>

          <p className="mt-2 text-3xl font-bold text-accent">
            {clients.length}
          </p>
        </section>

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
                <div className="mb-6 h-6 w-1/2 rounded bg-primary" />

                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-primary" />
                  <div className="h-4 w-2/3 rounded bg-primary" />
                  <div className="h-4 w-1/2 rounded bg-primary" />
                </div>

                <div className="mt-6 flex gap-3">
                  <div className="h-9 w-20 rounded-lg bg-primary" />
                  <div className="h-9 w-20 rounded-lg bg-primary" />
                </div>
              </div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-2xl border border-border/30 bg-surface p-10 text-center shadow-lg">
            <h2 className="text-2xl font-semibold">
              No clients yet
            </h2>

            <p className="mt-3 text-muted">
              Create your first client to start managing customer
              information.
            </p>
          </div>
        ) : (
          <>
            <ClientList
              clients={clients}
              editClient={editClient}
              deleteClient={deleteClient}
              onViewNotes={setSelectedClient}
            />

            {selectedClient && (
              <NotesPanel
                workspaceId={workspaceId}
                client={selectedClient}
                onClose={() => setSelectedClient(null)}
              />
            )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}

