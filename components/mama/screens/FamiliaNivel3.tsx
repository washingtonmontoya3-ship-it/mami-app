"use client";

import type { TreePerson } from "@/lib/types";
import BackButton from "../BackButton";

type FamiliaNivel3Props = {
  person: TreePerson;
  parentName?: string;
  onBack: () => void;
  onReplay: () => void;
};

export default function FamiliaNivel3({
  person,
  parentName,
  onBack,
  onReplay,
}: FamiliaNivel3Props) {
  const relation = person.relation ?? "familiar";

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      <div className="flex w-full max-w-2xl items-center">
        <BackButton onBack={onBack} />
      </div>

      {person.photo_url ? (
        <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-black shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.photo_url} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <span className="text-8xl" aria-hidden>
          👤
        </span>
      )}

      <h1 className="text-5xl font-bold">{person.name}</h1>
      <p className="text-3xl text-black/80">
        Tu {relation}
        {parentName ? `, de ${parentName}` : ""}
      </p>

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
