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
      className={`relative flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-blue-950 p-4 text-center shadow-lg active:scale-[0.98] ${
        highlighted ? "border-4 border-yellow-400 animate-gentle-glow" : ""
      }`}
    >
      {photoUrl ? (
        <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-4 border-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-1">
            <span className="block truncate text-lg font-bold leading-tight text-white">
              {label}
            </span>
          </div>
        </div>
      ) : (
        <>
          <span className="text-6xl" aria-hidden>
            {emoji ?? "👤"}
          </span>
          <span className="text-3xl font-bold leading-tight text-white">{label}</span>
        </>
      )}

      {photoUrl || children ? (
        <div className="flex w-full items-center justify-between">
          <div>
            {photoUrl ? (
              <button
                type="button"
                onClick={handleZoomClick}
                aria-label="Ver foto grande"
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-white text-3xl shadow-lg active:scale-95"
              >
                🔍
              </button>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      ) : null}

      {photoExpanded && photoUrl ? (
        <PhotoViewer photoUrl={photoUrl} onClose={() => setPhotoExpanded(false)} />
      ) : null}
    </div>
  );
}
