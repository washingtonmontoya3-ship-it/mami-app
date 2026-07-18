"use client";

type BackButtonProps = {
  onBack: () => void;
  label?: string;
};

// Boton contextual para volver un nivel (distinto del HomeButton global,
// que siempre vuelve al menu principal).
export default function BackButton({ onBack, label = "Volver" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="ml-28 flex h-16 items-center gap-3 rounded-2xl border-4 border-white bg-blue-950 px-6 text-2xl font-bold text-white shadow-md active:scale-95"
    >
      <span aria-hidden>⬅️</span>
      {label}
    </button>
  );
}
