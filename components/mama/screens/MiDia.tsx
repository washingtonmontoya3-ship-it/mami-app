"use client";

import { useEffect, useState } from "react";
import { isCurrentBlock } from "@/lib/routine";
import type { RoutineBlock } from "@/lib/types";
import BackButton from "../BackButton";
import BigCard from "../BigCard";

type MiDiaProps = {
  blocks: RoutineBlock[];
  onSelectBlock: (block: RoutineBlock) => void;
  onBack: () => void;
};

export default function MiDia({ blocks, onSelectBlock, onBack }: MiDiaProps) {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      <div className="flex w-full max-w-2xl items-center">
        <BackButton onBack={onBack} />
      </div>
      <h1 className="text-4xl font-bold">📅 Mi Día</h1>

      {blocks.length === 0 ? (
        <p className="text-2xl text-black/70">Todavía no hay rutina cargada acá.</p>
      ) : (
        <div className="flex w-full max-w-xl flex-col gap-6">
          {blocks.map((block) => (
            <BigCard
              key={block.id}
              label={block.time_label ?? block.title}
              emoji={block.icon ?? "🕐"}
              onTap={() => onSelectBlock(block)}
              highlighted={isCurrentBlock(block, hour)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
