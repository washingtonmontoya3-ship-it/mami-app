"use client";

import type { MouseEvent } from "react";
import { deletePerson, getChildren, updatePerson } from "@/lib/peopleAdmin";
import type { AdminPerson } from "@/lib/types";

type PersonBrowserProps = {
  people: AdminPerson[];
  parentId: string | null;
  title: string;
  onBack?: () => void;
  onNavigate: (person: AdminPerson) => void;
  onCreate: () => void;
  onEdit: (person: AdminPerson) => void;
  onChanged: () => void;
};

// Navegador "por ventanas": muestra solo los hijos directos de `parentId`
// (o los 14 hijos de mama en la raiz). Tocar el nombre/foto de una persona
// entra a la ventana de sus propios hijos.
export default function PersonBrowser({
  people,
  parentId,
  title,
  onBack,
  onNavigate,
  onCreate,
  onEdit,
  onChanged,
}: PersonBrowserProps) {
  const children = getChildren(people, parentId);

  async function toggleActive(event: { stopPropagation: () => void }, person: AdminPerson) {
    event.stopPropagation();
    await updatePerson(person.id, {
      name: person.name,
      relation: person.relation,
      parent_id: person.parent_id,
      phone_number: person.phone_number,
      is_active: !person.is_active,
      private_note: person.private_note,
      photo_url: person.photo_url,
      audio_url: person.audio_url,
    });
    onChanged();
  }

  async function handleDelete(event: MouseEvent, person: AdminPerson) {
    event.stopPropagation();
    const confirmed = window.confirm(
      `¿Eliminar a ${person.name}? Esto también elimina a todos sus descendientes en el árbol. Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    await deletePerson(person.id);
    onChanged();
  }

  function handleEdit(event: MouseEvent, person: AdminPerson) {
    event.stopPropagation();
    onEdit(person);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
            >
              ← Volver
            </button>
          ) : null}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
        >
          + Agregar persona
        </button>
      </div>

      {children.length === 0 ? (
        <p className="text-gray-500">Todavía no hay nadie cargado en esta ventana.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {children.map((person) => (
            <li
              key={person.id}
              onClick={() => onNavigate(person)}
              className="flex cursor-pointer items-center justify-between gap-3 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {person.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photo_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-gray-500">
                    {person.relation || "sin relación"}
                    {!person.is_active ? " · inactiva" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  className="flex items-center gap-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={person.is_active}
                    onChange={(e) => toggleActive(e, person)}
                  />
                  Activa
                </label>
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, person)}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, person)}
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600"
                >
                  Eliminar
                </button>
                <span className="text-gray-400">→</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
