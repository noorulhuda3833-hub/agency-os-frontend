"use client";

import { useEffect, useState, useTransition } from "react";
import { api } from "@/services/api";
import { cable } from "@/services/cable";

export default function NotesPanel({
  workspaceId,
  clientId,
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

  const [editingNote, setEditingNote] = useState(null);

  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState("");

  const [briefingHistory, setBriefingHistory] = useState([]);
  const [briefingHistoryLoading, setBriefingHistoryLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  const fetchNotes = async () => {
    if (!workspaceId || !client?.id) return;

    setLoading(true);
    setErrors([]);

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}/notes`
    );

    if (response.ok) {
      setNotes(response.data || []);
    } else {
      setErrors(
        response.data?.errors || [
          response.data?.error || "Failed to load notes.",
        ]
      );
    }

    setLoading(false);
  };

  const fetchBriefingHistory = async () => {
    if (!workspaceId || !client?.id) return;

    setBriefingHistoryLoading(true);

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}/briefing_documents`
    );

    if (response.ok) {
      setBriefingHistory(response.data || []);
    }

    setBriefingHistoryLoading(false);
  };

  useEffect(() => {
    if (!workspaceId || !client?.id) return;

    fetchNotes();
    fetchBriefingHistory();
  }, [workspaceId, client?.id]);

  useEffect(() => {
    if (!workspaceId || !client?.id) return;

    const subscription = cable.subscriptions.create(
      {
        channel: "NotesChannel",
        client_id: client.id,
      },
      {
        received(data) {
          console.log("WebSocket received:", data);

          if (data.action === "created") {
            setNotes((currentNotes) => {
              const alreadyExists = currentNotes.some(
                (note) => note.id === data.note.id
              );

              if (alreadyExists) {
                return currentNotes;
              }

              return [...currentNotes, data.note];
            });
          }

          if (data.action === "updated") {
            setNotes((currentNotes) =>
              currentNotes.map((note) =>
                note.id === data.note.id ? data.note : note
              )
            );
          }

          if (data.action === "deleted") {
            setNotes((currentNotes) =>
              currentNotes.filter(
                (note) => note.id !== data.note_id
              )
            );
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [workspaceId, client?.id]);

  function handleEdit(note) {
    setEditingNote(note);

    setTitle(note.title || "");
    setContent(note.content || "");
    setNoteType(note.note_type || "general");

    setErrors([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setNoteType("general");
    setErrors([]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!client?.id) {
      setErrors(["No client selected."]);
      return;
    }

    setSaving(true);
    setErrors([]);

    const path = editingNote
      ? `/workspaces/${workspaceId}/clients/${client.id}/notes/${editingNote.id}`
      : `/workspaces/${workspaceId}/clients/${client.id}/notes`;

    const method = editingNote ? "PATCH" : "POST";

    const response = await api(path, {
      method,
      body: JSON.stringify({
        note: {
          title,
          content,
          note_type: noteType,
        },
      }),
    });

    if (response.ok) {
      setTitle("");
      setContent("");
      setNoteType("general");
      setEditingNote(null);

      await fetchNotes();
    } else {
      setErrors(
        response.data?.errors || [
          response.data?.error || "Failed to save note.",
        ]
      );
    }

    setSaving(false);
  };

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setErrors([]);

    const response = await api(
      `/workspaces/${workspaceId}/clients/${client.id}/notes/${noteId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId)
      );
    } else {
      setErrors([
        response.data?.error || "Failed to delete note.",
      ]);
    }
  };

  const handleGenerateBriefing = async () => {
    if (!workspaceId || !client?.id) return;

    setBriefingLoading(true);
    setBriefingError("");
    setBriefing(null);

    startTransition(async () => {
      const response = await api(
        `/workspaces/${workspaceId}/clients/${client.id}/briefing`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setBriefing(response.data);
        await fetchBriefingHistory();
      } else {
        setBriefingError(
          response.data?.error || "Failed to generate AI briefing."
        );
      }

      setBriefingLoading(false);
    });
  };

  const renderBriefingContent = (briefingData) => {
    if (!briefingData) {
      return null;
    }

    if (typeof briefingData === "string") {
      return briefingData;
    }

    const content = briefingData.content || briefingData.briefing;

    if (typeof content === "string") {
      return content;
    }

    if (content && typeof content === "object") {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([section, value]) => (
            <div key={section}>
              <h5 className="font-semibold text-text">
                {section}
              </h5>

              <div className="mt-1 text-sm leading-6 text-muted">
                {typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return JSON.stringify(briefingData, null, 2);
  };

  if (!client) {
    return null;
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
            {client.name || "Client"}
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

      {/* AI Briefing */}
      <div className="mb-8 rounded-xl border border-border/30 bg-primary p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              AI Client Briefing
            </h3>

            <p className="mt-1 text-sm text-muted">
              Generate a briefing from this client's notes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateBriefing}
            disabled={briefingLoading || isPending}
            className="
              rounded-xl
              bg-accent
              px-5
              py-3
              font-semibold
              text-white
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {briefingLoading || isPending
              ? "Generating..."
              : "Generate AI Briefing"}
          </button>
        </div>

        {briefingError && !briefingLoading && !isPending && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-red-400">
                ⚠
              </div>

              <div>
                <h4 className="font-semibold text-red-400">
                  Unable to generate briefing
                </h4>

                <p className="mt-1 text-sm text-red-300">
                  {briefingError}
                </p>

                <button
                  type="button"
                  onClick={handleGenerateBriefing}
                  className="mt-3 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {(briefingLoading || isPending) && (
          <div className="mt-4 space-y-3 rounded-lg border border-border/30 bg-surface p-4 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-primary" />
            <div className="h-3 w-full rounded bg-primary" />
            <div className="h-3 w-5/6 rounded bg-primary" />
            <div className="h-3 w-2/3 rounded bg-primary" />
          </div>
        )}

        {briefing && !briefingLoading && !isPending && (
          <div className="mt-4 rounded-lg border border-border/30 bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  AI Briefing
                </h4>

                <p className="mt-1 text-xs text-muted">
                  Generated successfully from the client's notes.
                </p>
              </div>

              <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Success
              </span>
            </div>

            <div className="rounded-lg border border-border/30 bg-primary p-4">
              {renderBriefingContent(briefing)}
            </div>
          </div>
        )}
      </div>

      {/* Briefing History */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">
          Briefing History
        </h3>

        {briefingHistoryLoading ? (
          <p className="text-muted">
            Loading briefing history...
          </p>
        ) : briefingHistory.length === 0 ? (
          <p className="text-muted">
            No previous briefings yet.
          </p>
        ) : (
          <div className="space-y-4">
            {briefingHistory.map((document) => (
              <div
                key={document.id}
                className="
                  rounded-xl
                  border
                  border-border/30
                  bg-primary
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold">
                    AI Briefing
                  </h4>

                  <span className="text-xs text-muted">
                    {new Date(
                      document.created_at
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3">
                  {renderBriefingContent(document)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Composer */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {editingNote ? "Edit Note" : "Add Note"}
          </h3>

          {editingNote && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-muted hover:text-text"
            >
              Cancel
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
          onChange={(event) => setContent(event.target.value)}
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
            onChange={(event) => setNoteType(event.target.value)}
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
            {saving
              ? "Saving..."
              : editingNote
              ? "Update Note"
              : "Add Note"}
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
                    {note.title || "Untitled Note"}
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
                    {note.note_type || "general"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted">
                  {note.content || ""}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(note)}
                    className="
                      rounded-lg
                      border
                      border-border/30
                      px-3
                      py-2
                      text-sm
                      hover:bg-surface
                    "
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className="
                      rounded-lg
                      border
                      border-red-500/30
                      px-3
                      py-2
                      text-sm
                      text-red-400
                      hover:bg-red-500/10
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}