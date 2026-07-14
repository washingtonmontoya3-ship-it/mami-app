"use client";

import { buildAdminOrder, deletePerson, updatePerson } from "@/lib/peopleAdmin";
import type { AdminPerson } from "@/lib/types";

type PersonListProps = {
  people: AdminPerson[];
  onCreate: () => void;
  onEdit: (person: AdminPerson) => void;
  onChanged: () => void;
};

export default function PersonList({ people, onCreate, onEdit, onChanged }: PersonListProps) {
  async function toggleActive(person: AdminPerson) {
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

  async function handleDelete(person: AdminPerson) {
    const confirmed = window.confirm(
      `¿Eliminar a ${person.name}? Esto también elimina a todos sus descendientes en el árbol. Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    await deletePerson(person.id);
    onChanged();
  }

  const rows = buildAdminOrder(people);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personas</h1>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
        >
          + Agregar persona
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500">Todavía no hay nadie cargado.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {rows.map(({ person, depth }) => (
            <li
              key={person.id}
              className="flex items-center justify-between gap-3 py-3"
              style={{ paddingLeft: depth * 24 }}
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
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={person.is_active}
                    onChange={() => toggleActive(person)}
                  />
                  Activa
                </label>
                <button
                  type="button"
                  onClick={() => onEdit(person)}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(person)}
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
