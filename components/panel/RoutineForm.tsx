"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { createBlock, updateBlock } from "@/lib/routineAdmin";
import type { RoutineBlock, RoutineBlockInput } from "@/lib/types";
import FileUploadField from "./FileUploadField";

type RoutineFormProps = {
  initialValue?: RoutineBlock;
  onSaved: () => void;
  onCancel: () => void;
};

export default function RoutineForm({ initialValue, onSaved, onCancel }: RoutineFormProps) {
  const [timeLabel, setTimeLabel] = useState(initialValue?.time_label ?? "");
  const [startHour, setStartHour] = useState(initialValue?.start_hour ?? 8);
  const [endHour, setEndHour] = useState(initialValue?.end_hour ?? 12);
  const [icon, setIcon] = useState(initialValue?.icon ?? "");
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [audioUrl, setAudioUrl] = useState<string | null>(initialValue?.audio_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const input: RoutineBlockInput = {
      time_label: timeLabel || null,
      start_hour: startHour,
      end_hour: endHour,
      icon: icon || null,
      title,
      description: description || null,
      audio_url: audioUrl,
    };

    try {
      if (initialValue) {
        await updateBlock(initialValue.id, input);
      } else {
        await createBlock(input);
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
        {initialValue ? `Editar "${initialValue.title}"` : "Agregar bloque de rutina"}
      </h2>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Momento del día (ej. Mañana, Mediodía, Tarde, Noche)
        <input
          required
          value={timeLabel}
          onChange={(e) => setTimeLabel(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
          Empieza (hora, 0-23)
          <input
            type="number"
            min={0}
            max={23}
            required
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
          Termina (hora, 0-23)
          <input
            type="number"
            min={0}
            max={23}
            required
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Ícono (un emoji, ej. ☀️ 🍽️ 💊 🌙)
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Título (lo que ve mamá en grande, ej. &quot;Hora de tu medicina de la tarde&quot;)
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Descripción (opcional, texto más chico debajo del título)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>

      <FileUploadField
        label="Audio (opcional)"
        accept="audio/*"
        folder="audio"
        value={audioUrl}
        onChange={setAudioUrl}
      />

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
