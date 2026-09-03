"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import NotesPanel from "./components/NotesPanel";
import SelectedClient from "./components/SelectedClient";

import { api } from "@/services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company_id: "",
  company_name: "",
};

export default function ClientsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId;

  const dialogRef = useRef(null);

  const [workspace, setWorkspace] = useState(null);
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchWorkspace() {
    const response = await api(
      `/workspaces/${workspaceId}`
    );

    if (response.ok) {
      setWorkspace(response.data);
    }
  }

  async function fetchClients() {
    const response = await api(
      `/workspaces/${workspaceId}/clients`
    );

    if (response.ok) {
      setClients(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } else {
      setErrors(
        response.data?.errors || [
          "Failed to load clients.",
        ]
      );
    }
  }

  async function fetchCompanies() {
    const response = await api("/companies");

    if (response.ok) {
      setCompanies(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } else {
      setErrors(
        response.data?.errors || [
          "Failed to load companies.",
        ]
      );
    }
  }

  async function loadData() {
    setLoading(true);
    setErrors([]);

    await Promise.all([
      fetchWorkspace(),
      fetchClients(),
      fetchCompanies(),
    ]);

    setLoading(false);
  }

  useEffect(() => {
    if (!workspaceId) return;

    loadData();
  }, [workspaceId]);

  function openCreateModal() {
    setEditingClient(null);
    setForm({ ...emptyForm });
    setErrors([]);

    dialogRef.current?.showModal();
  }

  function openEditModal(client) {
    setEditingClient(client);

    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company_id: client.company_id
        ? String(client.company_id)
        : "",
      company_name: "",
    });

    setErrors([]);

    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setErrors([]);
  }

  function handleViewNotes(client) {
    setSelectedClient(client);
  }

  function handleCloseNotes() {
    setSelectedClient(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErrors([]);

    try {
      let companyId = form.company_id;

      /*
       * Create a new company if the user entered
       * a company name.
       */
      if (form.company_name?.trim()) {
        const companyResponse = await api(
          "/companies",
          {
            method: "POST",
            body: JSON.stringify({
              name: form.company_name.trim(),
            }),
          }
        );

        if (!companyResponse.ok) {
          setErrors(
            companyResponse.data?.errors || [
              "Failed to create company.",
            ]
          );

          return;
        }

        companyId = companyResponse.data.id;

        await fetchCompanies();
      }

      if (!companyId) {
        setErrors(["Company is required."]);
        return;
      }

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company_id: Number(companyId),
      };

      let response;

      if (editingClient) {
        response = await api(
          `/workspaces/${workspaceId}/clients/${editingClient.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await api(
          `/workspaces/${workspaceId}/clients`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (response.ok) {
        closeModal();

        setForm({ ...emptyForm });
        setEditingClient(null);

        await fetchClients();

        if (response.data) {
          setSelectedClient(response.data);
        }
      } else {
        setErrors(
          response.data?.errors || [
            "Failed to save client.",
          ]
        );
      }
    } catch (error) {
      console.error("Failed to save client:", error);

      setErrors([
        "Something went wrong. Please try again.",
      ]);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(client) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?`
    );

    if (!confirmed) return;

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      if (selectedClient?.id === client.id) {
        setSelectedClient(null);
      }

      await fetchClients();
    } else {
      setErrors(
        response.data?.errors || [
          "Failed to delete client.",
        ]
      );
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted">
          Loading clients...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-accent">
            {workspace?.name || "Workspace"}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Clients
          </h1>

          <p className="mt-2 text-muted">
            Manage your workspace clients and their companies.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-lg transition hover:brightness-110"
        >
          Add Client
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 p-4"
        >
          {errors.map((error, index) => (
            <p
              key={index}
              className="text-sm text-red-300"
            >
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Client List */}
      <ClientList
        clients={clients}
        editClient={openEditModal}
        deleteClient={handleDelete}
        onViewNotes={handleViewNotes}
        selectedClient={selectedClient}
      />

      {/* Selected Client */}
      {selectedClient && (
        <SelectedClient
          client={selectedClient}
          onEdit={openEditModal}
        />
      )}

      {/* Notes */}
      {selectedClient && (
        <NotesPanel
          workspaceId={workspaceId}
          clientId={selectedClient.id}
          client={selectedClient}
          onClose={handleCloseNotes}
        />
      )}

      {/* Client Form */}
      <ClientForm
        dialogRef={dialogRef}
        editingClient={editingClient}
        errors={errors}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        saving={saving}
        companies={companies}
      />
    </div>
  );
}