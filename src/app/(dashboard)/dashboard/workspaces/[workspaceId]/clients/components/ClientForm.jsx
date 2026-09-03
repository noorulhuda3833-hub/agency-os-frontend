"use client";

import { useEffect, useState } from "react";

export default function ClientForm({
  dialogRef,
  editingClient,
  errors,
  form,
  setForm,
  handleSubmit,
  closeModal,
  saving = false,
  companies = [],
}) {
  const [companyMode, setCompanyMode] = useState("existing");

  useEffect(() => {
    if (editingClient?.company_id) {
      setCompanyMode("existing");
    } else {
      setCompanyMode("existing");
    }
  }, [editingClient]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleCompanyModeChange(event) {
    const mode = event.target.value;

    setCompanyMode(mode);

    if (mode === "existing") {
      setForm((currentForm) => ({
        ...currentForm,
        company_id: currentForm.company_id || "",
        company_name: "",
      }));
    } else {
      setForm((currentForm) => ({
        ...currentForm,
        company_id: "",
        company_name: "",
      }));
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-xl rounded-2xl border border-border/30 bg-surface p-8 text-text shadow-2xl backdrop:bg-black/60"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-wider text-accent">
            Client Management
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {editingClient ? "Edit Client" : "Add Client"}
          </h2>

          <p className="mt-2 text-muted">
            {editingClient
              ? "Update the client information."
              : "Fill in the client details below."}
          </p>
        </div>

        {/* Errors */}
        {errors?.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 p-4"
          >
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-300">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Client Name */}
        <div>
          <label
            htmlFor="client-name"
            className="mb-2 block text-sm font-medium text-muted"
          >
            Client Name
          </label>

          <input
            id="client-name"
            type="text"
            name="name"
            placeholder="Enter client name"
            value={form.name || ""}
            onChange={handleChange}
            required
            autoComplete="name"
            disabled={saving}
            className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="client-email"
            className="mb-2 block text-sm font-medium text-muted"
          >
            Email Address
          </label>

          <input
            id="client-email"
            type="email"
            name="email"
            placeholder="client@example.com"
            value={form.email || ""}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={saving}
            className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="client-phone"
            className="mb-2 block text-sm font-medium text-muted"
          >
            Phone Number
          </label>

          <input
            id="client-phone"
            type="tel"
            name="phone"
            placeholder="03087545939"
            value={form.phone || ""}
            onChange={handleChange}
            required
            autoComplete="tel"
            disabled={saving}
            className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">
            Company
          </label>

          {/* Company mode */}
          <select
            value={companyMode}
            onChange={handleCompanyModeChange}
            disabled={saving}
            className="mb-3 w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="existing">Select Existing Company</option>
            <option value="new">Add New Company</option>
          </select>

          {companyMode === "existing" ? (
            <select
              id="client-company"
              name="company_id"
              value={form.company_id || ""}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Select a company
              </option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="client-company"
              type="text"
              name="company_name"
              placeholder="Enter new company name"
              value={form.company_name || ""}
              onChange={handleChange}
              required
              autoComplete="organization"
              disabled={saving}
              className="w-full rounded-xl border border-border/40 bg-primary px-4 py-3 text-text placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="rounded-xl border border-border/40 px-5 py-3 text-text transition hover:border-accent hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? editingClient
                ? "Updating..."
                : "Saving..."
              : editingClient
                ? "Update Client"
                : "Save Client"}
          </button>
        </div>
      </form>
    </dialog>
  );
}