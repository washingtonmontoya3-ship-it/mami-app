"use client";

import type { KeyboardEvent, MouseEvent } from "react";

type PhotoViewerProps = {
  photoUrl: string;
  onClose: () => void;
};

// Overlay de foto a pantalla completa. Se cierra tocando en cualquier lado
// o el boton "Cerrar". stopPropagation es necesario porque este componente
// se renderiza anidado dentro de la tarjeta que abrio la foto (BigCard) —
// sin esto, el click de cierre "se cuela" y tambien dispara la navegacion
// de esa tarjeta.
export default function PhotoViewer({ photoUrl, onClose }: PhotoViewerProps) {
  function handleClose(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    onClose();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          handleClose(e);
        }
      }}
      className="fixed inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center gap-6 bg-black p-6"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt=""
        className="max-h-[80vh] max-w-full rounded-2xl object-contain"
      />
      <span className="flex h-20 items-center gap-3 rounded-2xl border-4 border-white bg-black px-8 text-3xl font-bold text-white">
        ✕ Cerrar
      </span>
    </div>
  );
}
