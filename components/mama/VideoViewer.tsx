"use client";

import BackButton from "./BackButton";

type VideoViewerProps = {
  videoUrl: string;
  onClose: () => void;
};

// A diferencia de PhotoViewer, aca NO se cierra tocando el video: el toque
// tiene que poder usar los controles nativos (play/pausa/barra) sin cerrar
// por accidente. Por eso el "Volver" es un boton fijo en el flujo normal,
// no un toque en cualquier lado.
export default function VideoViewer({ videoUrl, onClose }: VideoViewerProps) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center gap-6 bg-black p-6">
      <div className="flex w-full max-w-2xl items-center">
        <BackButton onBack={onClose} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <video
          controls
          autoPlay
          playsInline
          src={videoUrl}
          className="max-h-[75vh] max-w-full rounded-2xl"
        />
      </div>
    </div>
  );
}
