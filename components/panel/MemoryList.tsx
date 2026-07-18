"use client";

import { deleteMemory, updateMemory } from "@/lib/memoriesAdmin";
import type { AdminMemory } from "@/lib/types";

type MemoryListProps = {
  memories: AdminMemory[];
  onCreate: () => void;
  onEdit: (memory: AdminMemory) => void;
  onChanged: () => void;
};

export default function MemoryList({ memories, onCreate, onEdit, onChanged }: MemoryListProps) {
  async function toggleActive(memory: AdminMemory) {
    await updateMemory(memory.id, {
      media_url: memory.media_url,
      media_type: memory.media_type,
      caption: memory.caption,
      is_active: !memory.is_active,
      private_note: memory.private_note,
    });
    onChanged();
  }

  async function handleDelete(memory: AdminMemory) {
    const confirmed = window.confirm(
      `¿Eliminar esta ${memory.media_type === "video" ? "video" : "foto"}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    await deleteMemory(memory.id);
    onChanged();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fotos y videos</h1>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
        >
          + Agregar foto o video
        </button>
      </div>

      {memories.length === 0 ? (
        <p className="text-gray-500">Todavía no hay nada cargado.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {memories.map((memory) => (
            <li key={memory.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                {memory.media_type === "video" ? (
                  <span className="text-2xl">🎬</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={memory.media_url}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{memory.caption || "Sin descripción"}</p>
                  <p className="text-sm text-gray-500">
                    {memory.media_type === "video" ? "Video" : "Foto"}
                    {!memory.is_active ? " · inactivo" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={memory.is_active}
                    onChange={() => toggleActive(memory)}
                  />
                  Activo
                </label>
                <button
                  type="button"
                  onClick={() => onEdit(memory)}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(memory)}
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
