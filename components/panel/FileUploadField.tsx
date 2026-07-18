"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { uploadMedia } from "@/lib/peopleAdmin";

type PreviewKind = "image" | "audio" | "video";

type FileUploadFieldProps = {
  label: string;
  accept: string;
  folder: "photos" | "audio" | "memories";
  value: string | null;
  onChange: (url: string | null) => void;
  onFileSelected?: (file: File) => void;
  previewAs?: PreviewKind;
};

export default function FileUploadField({
  label,
  accept,
  folder,
  value,
  onChange,
  onFileSelected,
  previewAs,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileSelected?.(file);
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMedia(file, folder);
      onChange(url);
    } catch {
      setError("No se pudo subir el archivo. Probá de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  const kind: PreviewKind = previewAs ?? (folder === "audio" ? "audio" : "image");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input type="file" accept={accept} onChange={handleFileChange} />
      {uploading ? <p className="text-sm text-gray-500">Subiendo...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {value && kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 w-24 rounded-full object-cover" />
      ) : null}
      {value && kind === "audio" ? <audio controls src={value} className="w-full" /> : null}
      {value && kind === "video" ? (
        <video controls src={value} className="h-32 w-auto rounded-lg" />
      ) : null}
      {value ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-fit text-sm text-red-600 underline"
        >
          Quitar
        </button>
      ) : null}
    </div>
  );
}
