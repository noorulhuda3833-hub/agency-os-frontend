"use client";

import { useEffect, useRef, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [errors, setErrors] = useState([]);

  const dialogRef = useRef(null);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openModal = () => {
    setErrors([]);
    dialogRef.current.showModal();
  };

  const closeModal = () => {
    dialogRef.current.close();

    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    try {
      const response = await fetch(
        "http://localhost:3000/workspaces/1/clients",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            company,
          }),
        }
      );

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-white p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-emerald-400">
            Clients
          </h1>

          <button
            onClick={openModal}
            className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg font-medium"
          >
            + Add Client
          </button>

        </div>

        <dialog
          ref={dialogRef}
          className="rounded-xl bg-zinc-900 text-white p-8 w-full max-w-lg"
        >
          
          <form onSubmit={handleSubmit} className="space-y-4">

  <h2 className="text-2xl font-bold mb-2">
    Add Client
  </h2>

  {errors.length > 0 && (
    <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
      {errors.map((error, index) => (
        <p key={index} className="text-red-300">
          {error}
        </p>
      ))}
    </div>
  )}

  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
    required
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
    required
  />
   <input
    type="text"
    placeholder="Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
    required
  />

  <input
    type="text"
    placeholder="Company"
    value={company}
    onChange={(e) => setCompany(e.target.value)}
    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
    required
  />
   <div className="flex justify-end gap-3 pt-2">

    <button
      type="button"
      onClick={closeModal}
      className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
    >
      Save Client
    </button>

  </div>

</form>

        </dialog>

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

        </div>
      </div>
    ))}

  </div>
)}

</div>
</AuthGuard>
);
}