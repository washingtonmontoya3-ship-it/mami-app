"use client";

import { deleteBlock } from "@/lib/routineAdmin";
import type { RoutineBlock } from "@/lib/types";

type RoutineListProps = {
  blocks: RoutineBlock[];
  onCreate: () => void;
  onEdit: (block: RoutineBlock) => void;
  onChanged: () => void;
};

export default function RoutineList({ blocks, onCreate, onEdit, onChanged }: RoutineListProps) {
  async function handleDelete(block: RoutineBlock) {
    const confirmed = window.confirm(`¿Eliminar el bloque "${block.title}"?`);
    if (!confirmed) return;
    await deleteBlock(block.id);
    onChanged();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rutina diaria</h1>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
        >
          + Agregar bloque
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="text-gray-500">Todavía no hay bloques de rutina cargados.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {blocks.map((block) => (
            <li key={block.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{block.icon || "🕐"}</span>
                <div>
                  <p className="font-semibold">
                    {block.time_label ?? "—"} · {block.start_hour}:00 a {block.end_hour}:00
                  </p>
                  <p className="text-sm text-gray-500">{block.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(block)}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(block)}
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
