"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { createMemory, updateMemory } from "@/lib/memoriesAdmin";
import type { AdminMemory, AdminMemoryInput, MediaType } from "@/lib/types";
import FileUploadField from "./FileUploadField";

type MemoryFormProps = {
  initialValue?: AdminMemory;
  onSaved: () => void;
  onCancel: () => void;
};

export default function MemoryForm({ initialValue, onSaved, onCancel }: MemoryFormProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(initialValue?.media_url ?? null);
  const [mediaType, setMediaType] = useState<MediaType>(initialValue?.media_type ?? "photo");
  const [caption, setCaption] = useState(initialValue?.caption ?? "");
  const [isActive, setIsActive] = useState(initialValue?.is_active ?? true);
  const [privateNote, setPrivateNote] = useState(initialValue?.private_note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(file: File) {
    setMediaType(file.type.startsWith("video/") ? "video" : "photo");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!mediaUrl) {
      setError("Subí una foto o un video.");
      return;
    }
    setSaving(true);
    setError(null);

    const input: AdminMemoryInput = {
      media_url: mediaUrl,
      media_type: mediaType,
      caption: caption || null,
      is_active: isActive,
      private_note: privateNote || null,
    };

    try {
      if (initialValue) {
        await updateMemory(initialValue.id, input);
      } else {
        await createMemory(input);
      }
      onSaved();
    } catch {
      setError("No se pudo guardar. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border p-4">
      <h2 className="text-xl font-bold">
        {initialValue ? "Editar recuerdo" : "Agregar foto o video"}
      </h2>

      <FileUploadField
        label="Foto o video"
        accept="image/*,video/*"
        folder="memories"
        value={mediaUrl}
        onChange={setMediaUrl}
        onFileSelected={handleFileSelected}
        previewAs={mediaType === "video" ? "video" : "image"}
      />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Descripción (opcional)
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ej. Cumpleaños de papá, 2019"
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Activo (visible en la app de mamá)
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Nota privada (solo para la familia, nunca se muestra en la app de mamá)
        <textarea
          value={privateNote ?? ""}
          onChange={(e) => setPrivateNote(e.target.value)}
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
