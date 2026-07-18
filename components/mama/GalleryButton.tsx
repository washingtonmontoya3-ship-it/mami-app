"use client";

type GalleryButtonProps = {
  onOpen: () => void;
};

// Siempre visible, en todas las pantallas, esquina opuesta al HomeButton.
// Un solo toque lleva directo a la galeria de fotos y videos.
export default function GalleryButton({ onOpen }: GalleryButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Fotos y videos"
      className="fixed right-4 top-4 z-50 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-yellow-300 text-4xl shadow-lg active:scale-95"
    >
      📷
    </button>
  );
}
