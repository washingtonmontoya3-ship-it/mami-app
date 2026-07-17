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

  return (
    <a
      href={`https://wa.me/${toWhatsAppNumber(phoneNumber)}`}
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

// wa.me exige el numero completo con codigo de pais, sin el 0 inicial que
// se usa para marcar en Ecuador (ej. "0994237748" -> "593994237748"). Si el
// numero ya viene con codigo de pais (no empieza en 0), se deja tal cual.
function toWhatsAppNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return digits.startsWith("0") ? `593${digits.slice(1)}` : digits;
}
