"use client";

import type { RoutineBlock } from "@/lib/types";
import BackButton from "../BackButton";

type MiDiaDetailProps = {
  block: RoutineBlock;
  onBack: () => void;
  onReplay: () => void;
};

export default function MiDiaDetail({ block, onBack, onReplay }: MiDiaDetailProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      <div className="flex w-full max-w-2xl items-center">
        <BackButton onBack={onBack} />
      </div>

      <span className="text-8xl" aria-hidden>
        {block.icon ?? "🕐"}
      </span>

      <h1 className="max-w-xl text-4xl font-bold">{block.title}</h1>
      {block.description ? (
        <p className="max-w-xl text-3xl text-black/80">{block.description}</p>
      ) : null}

      <button
        type="button"
        onClick={onReplay}
        className="flex h-20 items-center gap-3 rounded-2xl border-4 border-black bg-yellow-300 px-8 text-3xl font-bold shadow-lg active:scale-95"
      >
        🔊 Escuchar
      </button>
    </div>
  );
}
