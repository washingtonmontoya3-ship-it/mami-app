"use client";

import type { KeyboardEvent, MouseEvent } from "react";

type PhotoViewerProps = {
  photoUrl: string;
  onClose: () => void;
};

// Overlay de foto a pantalla completa. Se cierra tocando en cualquier lado
// o el boton "✕" de la esquina. Ese boton esta fijo a la esquina (no
// adentro del contenido centrado) para que siempre se vea, incluso si la
// foto es grande y en celulares chicos empujaria un boton "Cerrar" puesto
// debajo de la imagen fuera de la pantalla.
//
// stopPropagation es necesario porque este componente se renderiza anidado
// dentro de la tarjeta que abrio la foto (BigCard) — sin esto, el click de
// cierre "se cuela" y tambien dispara la navegacion de esa tarjeta.
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
      className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center overflow-auto bg-black/95 p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt=""
        className="max-h-[85vh] max-w-full rounded-2xl object-contain"
      />

      <button
        type="button"
        onClick={handleClose}
        aria-label="Cerrar"
        className="fixed right-4 top-4 z-[70] flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-black text-4xl text-white shadow-lg active:scale-95"
      >
        ✕
      </button>
    </div>
  );
}
