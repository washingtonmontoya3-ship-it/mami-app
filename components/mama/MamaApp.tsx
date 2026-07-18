"use client";

import { useEffect, useState } from "react";
import { fetchActiveMemories } from "@/lib/memories";
import { buildTree, fetchAllActivePeople } from "@/lib/people";
import type { FamilyTree, Memory, PublicPerson } from "@/lib/types";
import { usePersonAudio } from "./AudioPlayer";
import GalleryButton from "./GalleryButton";
import HomeButton from "./HomeButton";
import FamiliaDetail from "./screens/FamiliaDetail";
import FamiliaList from "./screens/FamiliaList";
import Gallery from "./screens/Gallery";

type ListScreen = { kind: "list"; personId: string | null; page: number };
type DetailScreen = { kind: "detail"; personId: string };
type GalleryScreen = { kind: "gallery"; page: number };
type Screen = ListScreen | DetailScreen | GalleryScreen;

const ROOT_SCREEN: ListScreen = { kind: "list", personId: null, page: 0 };

export default function MamaApp() {
  const [stack, setStack] = useState<Screen[]>([ROOT_SCREEN]);
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [error, setError] = useState(false);
  const { playFor, stop } = usePersonAudio();

  useEffect(() => {
    load();
  }, []);

  function load() {
    setError(false);
    setTree(null);
    setMemories(null);
    Promise.all([fetchAllActivePeople(), fetchActiveMemories()])
      .then(([people, memoryItems]) => {
        setTree(buildTree(people));
        setMemories(memoryItems);
      })
      .catch(() => setError(true));
  }

  function goHome() {
    stop();
    setStack([ROOT_SCREEN]);
  }

  function goBack() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }

  function goToGallery() {
    setStack((s) => [...s, { kind: "gallery", page: 0 }]);
  }

  function updateCurrentPage(page: number) {
    setStack((s) => {
      const top = s[s.length - 1];
      if (top.kind !== "list" && top.kind !== "gallery") return s;
      return [...s.slice(0, -1), { ...top, page }];
    });
  }

  function selectPerson(person: PublicPerson) {
    playFor(person);
    const hasChildren = (tree?.childrenByParent.get(person.id)?.length ?? 0) > 0;
    setStack((s) => [
      ...s,
      hasChildren
        ? { kind: "list", personId: person.id, page: 0 }
        : { kind: "detail", personId: person.id },
    ]);
  }

  if (error) {
    return (
      <Centered>
        <p className="text-3xl font-semibold text-white">No se pudo cargar tu familia.</p>
        <button
          type="button"
          onClick={load}
          className="flex h-20 items-center gap-3 rounded-2xl border-4 border-black bg-yellow-300 px-8 text-3xl font-bold shadow-lg active:scale-95"
        >
          🔄 Intentar de nuevo
        </button>
      </Centered>
    );
  }

  if (!tree || !memories) {
    return (
      <Centered>
        <p className="text-3xl font-semibold text-white">Cargando tu familia...</p>
      </Centered>
    );
  }

  const current = stack[stack.length - 1];

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-blue-950">
      <HomeButton onHome={goHome} />
      <GalleryButton onOpen={goToGallery} />

      {current.kind === "list" &&
        (() => {
          const people =
            current.personId === null
              ? tree.roots
              : tree.childrenByParent.get(current.personId) ?? [];
          const parent = current.personId ? tree.personById.get(current.personId) : undefined;
          const title = parent ? `Familia de ${parent.name}` : "👨‍👩‍👧‍👦 Mi Familia";
          return (
            <FamiliaList
              people={people}
              page={current.page}
              onPageChange={updateCurrentPage}
              onSelectPerson={selectPerson}
              onBack={stack.length > 1 ? goBack : undefined}
              title={title}
              showWhatsApp={current.personId === null}
            />
          );
        })()}

      {current.kind === "detail" &&
        (() => {
          const person = tree.personById.get(current.personId);
          if (!person) return null;
          const parentName = person.parent_id
            ? tree.personById.get(person.parent_id)?.name
            : undefined;
          return (
            <FamiliaDetail
              person={person}
              parentName={parentName}
              onBack={goBack}
              onReplay={() => playFor(person)}
            />
          );
        })()}

      {current.kind === "gallery" && (
        <Gallery
          items={memories}
          page={current.page}
          onPageChange={updateCurrentPage}
          onBack={goBack}
        />
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-blue-950 px-6 text-center">
      {children}
    </div>
  );
}
