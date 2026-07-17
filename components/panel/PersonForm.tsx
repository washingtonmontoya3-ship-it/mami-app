"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { buildAdminOrder, createPerson, updatePerson } from "@/lib/peopleAdmin";
import type { AdminPerson, AdminPersonInput } from "@/lib/types";
import FileUploadField from "./FileUploadField";

// Codigos de pais de la familia. Agregar mas paises acá si hace falta.
const COUNTRY_CODES = [
  { code: "593", label: "🇪🇨 Ecuador" },
  { code: "34", label: "🇪🇸 España" },
];

// El numero se guarda siempre completo (codigo de pais + numero local, sin
// 0 inicial ni espacios) para que wa.me lo reconozca sin adivinar. Esta
// funcion separa un numero ya guardado en sus dos partes para editarlo; si
// viene en formato local viejo (ej. "0994237748", de antes de este campo
// existir) asume Ecuador y le saca el 0 inicial.
function parsePhone(stored: string | null): { country: string; local: string } {
  const digits = (stored ?? "").replace(/\D/g, "");
  for (const { code } of COUNTRY_CODES) {
    if (digits.startsWith(code)) return { country: code, local: digits.slice(code.length) };
  }
  if (digits.startsWith("0")) return { country: "593", local: digits.slice(1) };
  return { country: "593", local: digits };
}

type PersonFormProps = {
  allPeople: AdminPerson[];
  initialValue?: AdminPerson;
  defaultParentId?: string | null;
  onSaved: () => void;
  onCancel: () => void;
};

export default function PersonForm({
  allPeople,
  initialValue,
  defaultParentId,
  onSaved,
  onCancel,
}: PersonFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [relation, setRelation] = useState(initialValue?.relation ?? "");
  const [parentId, setParentId] = useState(
    initialValue?.parent_id ?? defaultParentId ?? ""
  );
  const initialPhone = parsePhone(initialValue?.phone_number ?? null);
  const [phoneCountry, setPhoneCountry] = useState(initialPhone.country);
  const [phoneLocal, setPhoneLocal] = useState(initialPhone.local);
  const [isActive, setIsActive] = useState(initialValue?.is_active ?? true);
  const [privateNote, setPrivateNote] = useState(initialValue?.private_note ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialValue?.photo_url ?? null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialValue?.audio_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const excludedIds = initialValue ? descendantIdsOf(initialValue.id, allPeople) : new Set<string>();
  const parentOptions = buildAdminOrder(allPeople).filter(
    (row) => !excludedIds.has(row.person.id)
  );

  const isHijoDirecto = parentId === "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const cleanLocal = phoneLocal.replace(/\D/g, "");
    const input: AdminPersonInput = {
      name,
      relation: relation || null,
      parent_id: parentId || null,
      phone_number: isHijoDirecto && cleanLocal ? `${phoneCountry}${cleanLocal}` : null,
      is_active: isActive,
      private_note: privateNote || null,
      photo_url: photoUrl,
      audio_url: audioUrl,
    };

    try {
      if (initialValue) {
        await updatePerson(initialValue.id, input);
      } else {
        await createPerson(input);
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
        {initialValue ? `Editar a ${initialValue.name}` : "Agregar persona"}
      </h2>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Nombre
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Relación (ej. hijo, nieta, esposo)
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Padre / madre en el árbol
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        >
          <option value="">— Ninguno (hijo/a directo/a de mamá) —</option>
          {parentOptions.map(({ person, depth }) => (
            <option key={person.id} value={person.id}>
              {"—".repeat(depth)} {person.name}
            </option>
          ))}
        </select>
      </label>

      {isHijoDirecto ? (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Teléfono (para el botón de WhatsApp)
          <div className="flex gap-2">
            <select
              value={phoneCountry}
              onChange={(e) => setPhoneCountry(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
            >
              {COUNTRY_CODES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneLocal}
              onChange={(e) => setPhoneLocal(e.target.value)}
              placeholder={phoneCountry === "593" ? "994237748" : "612345678"}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-normal"
            />
          </div>
          <span className="text-xs font-normal text-gray-500">
            Sin el 0 inicial ni espacios (solo los números).
          </span>
        </label>
      ) : null}

      <FileUploadField
        label="Foto"
        accept="image/*"
        folder="photos"
        value={photoUrl}
        onChange={setPhotoUrl}
      />

      <FileUploadField
        label="Audio (nombre + relación)"
        accept="audio/*"
        folder="audio"
        value={audioUrl}
        onChange={setAudioUrl}
      />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Activa (visible en la app de mamá)
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

function descendantIdsOf(rootId: string, people: AdminPerson[]): Set<string> {
  const childrenByParent = new Map<string, AdminPerson[]>();
  for (const person of people) {
    if (!person.parent_id) continue;
    const siblings = childrenByParent.get(person.parent_id) ?? [];
    siblings.push(person);
    childrenByParent.set(person.parent_id, siblings);
  }

  const result = new Set<string>([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    for (const child of childrenByParent.get(id) ?? []) {
      result.add(child.id);
      queue.push(child.id);
    }
  }
  return result;
}
