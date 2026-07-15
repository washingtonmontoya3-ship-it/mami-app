"use client";

import type { MouseEvent } from "react";

type WhatsAppButtonProps = {
  phoneNumber: string;
};

// Boton de contacto directo, solo para hijos (Nivel raiz). Visualmente
// distinto (verde, esquina de la tarjeta) para no confundirse con el toque
// que navega al arbol familiar de ese hijo. stopPropagation evita que el
// click tambien dispare el onTap de la tarjeta contenedora.
export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  const digits = phoneNumber.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Escribir por WhatsApp"
      className="absolute -right-3 -top-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-green-500 text-4xl text-white shadow-lg active:scale-95"
    >
      💬
    </a>
  );
}
