
"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function NotesPanel({
  workspaceId,
  client,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("general");

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  // Fetch notes for the selected client
  async function fetchNotes() {
    setLoading(true);
    setErrors([]);

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}/notes`
    );

    if (response.ok) {
      setNotes(response.data || []);
    } else {
      setErrors(
        response.data?.errors ||
          [response.data?.error || "Failed to load notes."]
      );
    }

    setLoading(false);
  }

  // Load notes whenever the selected client changes
  useEffect(() => {
    if (!workspaceId || !client?.id) return;

    fetchNotes();
  }, [workspaceId, client?.id]);

  // Create a new note
  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErrors([]);

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}/notes`,
      {
        method: "POST",
        body: JSON.stringify({
          note: {
            title,
            content,
            note_type: noteType,
          },
        }),
      }
    );

    if (response.ok) {
      setNotes((currentNotes) => [
        ...currentNotes,
        response.data,
      ]);

      setTitle("");
      setContent("");
      setNoteType("general");
    } else {
      setErrors(
        response.data?.errors ||
          [response.data?.error || "Failed to create note."]
      );
    }

    setSaving(false);
  }

  return (
    <div className="mt-6 rounded-2xl border border-border/30 bg-surface p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-accent">
            Notes
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {client.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-lg
            border
            border-border/30
            px-4
            py-2
            text-sm
            hover:bg-primary
          "
        >
          Close
        </button>
      </div>

      {/* Note Composer */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          className="
            w-full
            rounded-xl
            border
            border-border/30
            bg-primary
            px-4
            py-3
            outline-none
            focus:border-accent
          "
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          rows={5}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-border/30
            bg-primary
            px-4
            py-3
            outline-none
            focus:border-accent
          "
        />

        <div className="flex gap-4">
          <select
            value={noteType}
            onChange={(event) =>
              setNoteType(event.target.value)
            }
            className="
              rounded-xl
              border
              border-border/30
              bg-primary
              px-4
              py-3
              outline-none
            "
          >
            <option value="general">General</option>
            <option value="meeting">Meeting</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="task">Task</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="
              rounded-xl
              bg-accent
              px-5
              py-3
              font-semibold
              text-white
              hover:brightness-110
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Add Note"}
          </button>
        </div>
      </form>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-500/30 p-4">
          {errors.map((error, index) => (
            <p
              key={index}
              className="text-sm text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Note History */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Note History
        </h3>

        {loading ? (
          <p className="text-muted">
            Loading notes...
          </p>
        ) : notes.length === 0 ? (
          <p className="text-muted">
            No notes yet.
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="
                  rounded-xl
                  border
                  border-border/30
                  bg-primary
                  p-4
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold">
                    {note.title}
                  </h4>

                  <span
                    className="
                      rounded-lg
                      bg-accent/10
                      px-2
                      py-1
                      text-xs
                      text-accent
                    "
                  >
                    {note.note_type}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

