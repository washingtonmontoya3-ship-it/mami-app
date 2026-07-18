"use client";

import type { PublicPerson } from "@/lib/types";
import BackButton from "../BackButton";
import PaginatedGrid from "../PaginatedGrid";
import PersonCard from "../PersonCard";

type FamiliaListProps = {
  people: PublicPerson[];
  page: number;
  onPageChange: (page: number) => void;
  onSelectPerson: (person: PublicPerson) => void;
  onBack?: () => void;
  title: string;
  showWhatsApp: boolean;
};

// Pantalla generica reutilizada en cualquier nivel del arbol: la raiz (los
// hijos de mama) y cada nivel de descendientes despues, sin importar la
// profundidad real (hijo -> nieto -> bisnieto -> ...).
export default function FamiliaList({
  people,
  page,
  onPageChange,
  onSelectPerson,
  onBack,
  title,
  showWhatsApp,
}: FamiliaListProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      {onBack ? (
        <div className="flex w-full max-w-2xl items-center">
          <BackButton onBack={onBack} />
        </div>
      ) : null}

      <h1 className="text-4xl font-bold text-white">{title}</h1>

      {people.length === 0 ? (
        <p className="text-2xl text-white/70">Todavía no hay fotos cargadas acá.</p>
      ) : (
        <PaginatedGrid
          items={people}
          page={page}
          onPageChange={onPageChange}
          getKey={(person) => person.id}
          renderItem={(person) => (
            <PersonCard person={person} onTap={onSelectPerson} showWhatsApp={showWhatsApp} />
          )}
        />
      )}
    </div>
  );
}
