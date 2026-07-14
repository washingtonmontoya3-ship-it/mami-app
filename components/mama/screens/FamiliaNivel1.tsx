"use client";

import type { PublicPerson } from "@/lib/types";
import PaginatedGrid from "../PaginatedGrid";
import PersonCard from "../PersonCard";

type FamiliaNivel1Props = {
  hijos: PublicPerson[];
  page: number;
  onPageChange: (page: number) => void;
  onSelectHijo: (hijo: PublicPerson) => void;
};

export default function FamiliaNivel1({
  hijos,
  page,
  onPageChange,
  onSelectHijo,
}: FamiliaNivel1Props) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      <h1 className="text-4xl font-bold">👨‍👩‍👧‍👦 Mi Familia</h1>
      <PaginatedGrid
        items={hijos}
        page={page}
        onPageChange={onPageChange}
        getKey={(hijo) => hijo.id}
        renderItem={(hijo) => (
          <PersonCard person={hijo} onTap={onSelectHijo} showCallButton />
        )}
      />
    </div>
  );
}
