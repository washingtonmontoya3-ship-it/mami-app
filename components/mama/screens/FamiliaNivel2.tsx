"use client";

import type { PublicPerson, TreePerson } from "@/lib/types";
import BackButton from "../BackButton";
import PaginatedGrid from "../PaginatedGrid";
import PersonCard from "../PersonCard";

type FamiliaNivel2Props = {
  hijo: PublicPerson;
  descendants: TreePerson[];
  page: number;
  onPageChange: (page: number) => void;
  onSelectPerson: (person: TreePerson) => void;
  onBack: () => void;
};

export default function FamiliaNivel2({
  hijo,
  descendants,
  page,
  onPageChange,
  onSelectPerson,
  onBack,
}: FamiliaNivel2Props) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      <div className="flex w-full max-w-2xl items-center">
        <BackButton onBack={onBack} />
      </div>
      <h1 className="text-4xl font-bold">Familia de {hijo.name}</h1>
      {descendants.length === 0 ? (
        <p className="text-2xl text-black/70">Todavía no hay fotos cargadas acá.</p>
      ) : (
        <PaginatedGrid
          items={descendants}
          page={page}
          onPageChange={onPageChange}
          getKey={(person) => person.id}
          renderItem={(person) => <PersonCard person={person} onTap={onSelectPerson} />}
        />
      )}
    </div>
  );
}
