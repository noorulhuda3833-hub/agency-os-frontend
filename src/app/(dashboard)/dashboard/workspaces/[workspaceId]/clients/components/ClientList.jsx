"use client";

export default function ClientList({
  clients,
  editClient,
  deleteClient,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className="
            bg-surface
            border
            border-border/30
            rounded-2xl
            p-6
            shadow-md
            transition-all
            duration-200
            hover:-translate-y-1
            hover:shadow-xl
            hover:border-accent
          "
        >
          <h2 className="text-xl font-bold text-accent mb-5">
            {client.name}
          </h2>

          <div className="space-y-3 text-muted">

            <p>
              <span className="font-semibold text-text">
                Email:
              </span>{" "}
              {client.email}
            </p>

            <p>
              <span className="font-semibold text-text">
                Phone:
              </span>{" "}
              {client.phone}
            </p>

            <p>
              <span className="font-semibold text-text">
                Company:
              </span>{" "}
              {client.company}
            </p>

            <div className="flex gap-3 pt-6">

              <button
                onClick={() => editClient(client)}
                className="
                  flex-1
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-border/50
                  text-text
                  transition-all
                  duration-200
                  hover:bg-accent
                  hover:border-accent
                  hover:shadow-md
                "
              >
                Edit
              </button>

              <button
                onClick={() => deleteClient(client.id)}
                className="
                  flex-1
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-red-500/40
                  text-red-300
                  transition-all
                  duration-200
                  hover:bg-red-600
                  hover:border-red-600
                  hover:text-white
                  hover:shadow-md
                "
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      ))}
    </div>
  );
}