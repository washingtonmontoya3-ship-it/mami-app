"use client";

type HomeButtonProps = {
  onHome: () => void;
};

// Siempre visible, en todas las pantallas, en la misma esquina. Un solo
// toque vuelve directo al menu principal sin importar en que nivel este.
export default function HomeButton({ onHome }: HomeButtonProps) {
  return (
    <button
      type="button"
      onClick={onHome}
      aria-label="Inicio"
      className="fixed left-4 top-4 z-50 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-yellow-300 text-4xl shadow-lg active:scale-95"
    >
      🏠
    </button>
  );
}
