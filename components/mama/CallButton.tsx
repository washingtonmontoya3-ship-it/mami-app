"use client";

import type { MouseEvent } from "react";

type CallButtonProps = {
  phoneNumber: string;
};

// Boton de llamada directa, solo para hijos (Nivel 1). Visualmente distinto
// (verde, esquina de la tarjeta) para no confundirse con el toque que
// navega al arbol familiar de ese hijo. stopPropagation evita que el click
// tambien dispare el onTap de la tarjeta contenedora.
export default function CallButton({ phoneNumber }: CallButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      aria-label="Llamar"
      className="absolute -right-3 -top-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-green-500 text-4xl text-white shadow-lg active:scale-95"
    >
      📞
    </a>
  );
}
