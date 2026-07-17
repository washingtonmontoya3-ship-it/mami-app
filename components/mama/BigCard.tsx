"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import PhotoViewer from "./PhotoViewer";

type BigCardProps = {
  label: string;
  photoUrl?: string | null;
  emoji?: string;
  onTap: () => void;
  children?: ReactNode;
  highlighted?: boolean;
};

// Tarjeta tactil generica: foto (o emoji como respaldo) + texto grande.
// Minimo 200px de alto, un solo toque, contraste alto.
//
// Es un <div role="button"> en vez de un <button> nativo a proposito: cuando
// se usa dentro de PersonCard, necesita poder anidar un CallButton (<a
// href="tel:...">), y un <a> dentro de un <button> es HTML invalido.
export default function BigCard({
  label,
  photoUrl,
  emoji,
  onTap,
  children,
  highlighted = false,
}: BigCardProps) {
  const [photoExpanded, setPhotoExpanded] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTap();
    }
  }

  function handleZoomClick(event: MouseEvent) {
    event.stopPropagation();
    setPhotoExpanded(true);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      className={`relative flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-4 bg-white p-4 text-center shadow-lg active:scale-[0.98] ${
        highlighted ? "border-yellow-400 animate-gentle-glow" : "border-black"
      }`}
    >
      {photoUrl ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <span className="text-6xl" aria-hidden>
          {emoji ?? "👤"}
        </span>
      )}
      <span className="text-3xl font-bold leading-tight text-black">{label}</span>

      {photoUrl ? (
        <button
          type="button"
          onClick={handleZoomClick}
          aria-label="Ver foto grande"
          className="absolute -left-3 -top-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-white text-3xl shadow-lg active:scale-95"
        >
          🔍
        </button>
      ) : null}

      {children}

      {photoExpanded && photoUrl ? (
        <PhotoViewer photoUrl={photoUrl} onClose={() => setPhotoExpanded(false)} />
      ) : null}
    </div>
  );
}
