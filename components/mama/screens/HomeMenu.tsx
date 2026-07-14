"use client";

import BigCard from "../BigCard";

type HomeMenuProps = {
  onFamilia: () => void;
  onDia: () => void;
};

export default function HomeMenu({ onFamilia, onDia }: HomeMenuProps) {
  return (
    <div className="flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-8 px-6">
      <BigCard label="Mi Familia" emoji="👨‍👩‍👧‍👦" onTap={onFamilia} />
      <BigCard label="Mi Día" emoji="📅" onTap={onDia} />
    </div>
  );
}
