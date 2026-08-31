"use client";

export default function SelectedClient({
  client,
  onEdit,
  onDelete,
  onClose,
}) {
  if (!client) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-border/30 bg-surface shadow-lg">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Selected Client
          </p>

          <h2 className="mt-1 text-2xl font-bold text-text">
            {client.name}
          </h2>

          <p className="mt-2 text-sm text-muted">
            {[
              client.company,
              client.email,
              client.phone,
              client.city,
              client.country,
            ]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(client)}
            className="
              rounded-xl
              border
              border-border/50
              px-4
              py-2
              text-sm
              font-medium
              text-text
              transition
              hover:border-accent
              hover:bg-accent
              hover:text-white
            "
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(client.id)}
            className="
              rounded-xl
              border
              border-red-500/40
              px-4
              py-2
              text-sm
              font-medium
              text-red-400
              transition
              hover:border-red-600
              hover:bg-red-600
              hover:text-white
            "
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-border/50
              px-4
              py-2
              text-sm
              font-medium
              text-muted
              transition
              hover:bg-primary
              hover:text-text
            "
          >
            Close
          </button>
        </div>
      </div>

      <div className="border-t border-border/30 px-6 py-4">
        <p className="text-sm text-muted">
          Client notes and activity are shown below.
        </p>
      </div>
    </section>
  );
}