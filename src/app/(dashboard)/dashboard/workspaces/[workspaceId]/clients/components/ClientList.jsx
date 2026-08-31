"use client";

export default function ClientList({
  clients,
  editClient,
  deleteClient,
  onViewNotes,
  selectedClient,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => {
        const isSelected = selectedClient?.id === client.id;

        return (
          <div
            key={client.id}
            className={`
              rounded-2xl
              border
              bg-surface
              p-6
              shadow-md
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-xl
              ${
                isSelected
                  ? "border-accent shadow-lg"
                  : "border-border/30 hover:border-accent"
              }
            `}
          >
            {/* Client Name */}
            <h2 className="mb-5 text-xl font-bold text-accent">
              {client.name}
            </h2>

            {/* Client Information */}
            <div className="space-y-3 text-muted">
              <p className="wrap-break-words">
                <span className="font-semibold text-text">
                  Email:
                </span>{" "}
                {client.email || "N/A"}
              </p>

              <p>
                <span className="font-semibold text-text">
                  Phone:
                </span>{" "}
                {client.phone || "N/A"}
              </p>

              <p>
                <span className="font-semibold text-text">
                  Company:
                </span>{" "}
                {client.company || "N/A"}
              </p>

              {/* Edit & Delete */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => editClient(client)}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-border/50
                    px-4
                    py-2
                    text-text
                    transition-all
                    duration-200
                    hover:border-accent
                    hover:bg-accent
                    hover:shadow-md
                  "
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteClient(client.id)}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-red-500/40
                    px-4
                    py-2
                    text-red-300
                    transition-all
                    duration-200
                    hover:border-red-600
                    hover:bg-red-600
                    hover:text-white
                    hover:shadow-md
                  "
                >
                  Delete
                </button>
              </div>

              {/* View Notes */}
              <button
                type="button"
                onClick={() => onViewNotes(client)}
                className={`
                  mt-3
                  w-full
                  rounded-xl
                  px-4
                  py-2
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:brightness-110
                  hover:shadow-md
                  ${
                    isSelected
                      ? "bg-accent/80"
                      : "bg-accent"
                  }
                `}
              >
                {isSelected ? "Notes Selected" : "View Notes"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}