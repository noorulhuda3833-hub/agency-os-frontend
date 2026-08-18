"use client";

export default function ClientForm({
  dialogRef,
  editingClient,
  errors,
  form,
  setForm,
  handleSubmit,
  closeModal,
}) {
  return (
    <dialog
      ref={dialogRef}
      className="
        w-full
        max-w-xl
        rounded-2xl
        bg-surface
        border
        border-border/30
        p-8
        text-text
        shadow-2xl
        backdrop:bg-black/60
      "
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <p className="text-sm uppercase tracking-wider text-accent">
            Client Management
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {editingClient ? "Edit Client" : "Add Client"}
          </h2>

          <p className="text-muted mt-2">
            {editingClient
              ? "Update the client information."
              : "Fill in the client details below."}
          </p>
        </div>

        {errors.length > 0 && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-300">
                {error}
              </p>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Client Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            border-border/40
            bg-primary
            px-4
            py-3
            text-text
            placeholder:text-muted
            transition
            focus:border-accent
            focus:ring-2
            focus:ring-accent/20
            focus:outline-none
          "
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            border-border/40
            bg-primary
            px-4
            py-3
            text-text
            placeholder:text-muted
            transition
            focus:border-accent
            focus:ring-2
            focus:ring-accent/20
            focus:outline-none
          "
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            border-border/40
            bg-primary
            px-4
            py-3
            text-text
            placeholder:text-muted
            transition
            focus:border-accent
            focus:ring-2
            focus:ring-accent/20
            focus:outline-none
          "
          required
        />

        <input
          type="text"
          placeholder="Company Name"
          value={form.company}
          onChange={(e) =>
            setForm({
              ...form,
              company: e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            border-border/40
            bg-primary
            px-4
            py-3
            text-text
            placeholder:text-muted
            transition
            focus:border-accent
            focus:ring-2
            focus:ring-accent/20
            focus:outline-none
          "
          required
        />

        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={closeModal}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-border/40
              text-text
              transition
              hover:bg-primary
              hover:border-accent
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
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
            {editingClient ? "Update Client" : "Save Client"}
          </button>

        </div>

      </form>
    </dialog>
  );
}