"use client";

import type { KeyboardEvent, MouseEvent } from "react";

type PhotoViewerProps = {
  photoUrl: string;
  onClose: () => void;
};

// Overlay de foto a pantalla completa. Se cierra tocando en cualquier lado.
//
// stopPropagation es necesario porque este componente se renderiza anidado
// dentro de la tarjeta que abrio la foto (BigCard) — sin esto, el click de
// cierre "se cuela" y tambien dispara la navegacion de esa tarjeta.
//
// pointer-events-none en la imagen (para que el toque siempre llegue al div
// de afuera, no quede "atrapado" en un gesto de arrastrar/guardar imagen del
// navegador del celular) + touch-manipulation (evita el retraso que esperan
// los navegadores moviles por si el toque es un doble-tap de zoom) es lo que
// hace que cerrar con un toque funcione de forma confiable en celulares.
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
      className="fixed inset-0 z-[60] flex touch-manipulation cursor-pointer select-none items-center justify-center bg-black/95 p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt=""
        draggable={false}
        className="pointer-events-none max-h-[85vh] max-w-full rounded-2xl object-contain"
      />
    </div>
  );
}
