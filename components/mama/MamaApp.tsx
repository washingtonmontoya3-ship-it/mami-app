"use client";

import { useEffect, useState } from "react";
import { buildTree, fetchAllActivePeople } from "@/lib/people";
import { fetchRoutineBlocks } from "@/lib/routine";
import type { FamilyTree, PublicPerson, RoutineBlock, TreePerson } from "@/lib/types";
import { usePersonAudio } from "./AudioPlayer";
import HomeButton from "./HomeButton";
import FamiliaNivel1 from "./screens/FamiliaNivel1";
import FamiliaNivel2 from "./screens/FamiliaNivel2";
import FamiliaNivel3 from "./screens/FamiliaNivel3";
import HomeMenu from "./screens/HomeMenu";
import MiDia from "./screens/MiDia";
import MiDiaDetail from "./screens/MiDiaDetail";

type Screen =
  | { name: "home" }
  | { name: "dia" }
  | { name: "dia-detail"; blockId: string }
  | { name: "familia-n1"; page: number }
  | { name: "familia-n2"; hijoId: string; page: number }
  | { name: "familia-n3"; personId: string; hijoId: string; n2Page: number };

export default function MamaApp() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[] | null>(null);
  const [error, setError] = useState(false);
  const { playFor, stop } = usePersonAudio();

  useEffect(() => {
    load();
  }, []);

  function load() {
    setError(false);
    setTree(null);
    setRoutineBlocks(null);
    Promise.all([fetchAllActivePeople(), fetchRoutineBlocks()])
      .then(([people, blocks]) => {
        setTree(buildTree(people));
        setRoutineBlocks(blocks);
      })
      .catch(() => setError(true));
  }

  function goHome() {
    stop();
    setScreen({ name: "home" });
  }

  function goToFamilia() {
    setScreen({ name: "familia-n1", page: 0 });
  }

  function goToDia() {
    setScreen({ name: "dia" });
  }

  function selectHijo(hijo: PublicPerson) {
    playFor(hijo);
    setScreen({ name: "familia-n2", hijoId: hijo.id, page: 0 });
  }

  function selectDescendant(hijoId: string, n2Page: number, person: TreePerson) {
    playFor(person);
    setScreen({ name: "familia-n3", personId: person.id, hijoId, n2Page });
  }

  function selectBlock(block: RoutineBlock) {
    playFor({ name: block.title, relation: null, audio_url: block.audio_url });
    setScreen({ name: "dia-detail", blockId: block.id });
  }

  if (error) {
    return (
      <Centered>
        <p className="text-3xl font-semibold">No se pudo cargar tu familia.</p>
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

  if (!tree || !routineBlocks) {
    return (
      <Centered>
        <p className="text-3xl font-semibold">Cargando tu familia...</p>
      </Centered>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50">
      <HomeButton onHome={goHome} />

      {screen.name === "home" && <HomeMenu onFamilia={goToFamilia} onDia={goToDia} />}

      {screen.name === "dia" && (
        <MiDia blocks={routineBlocks} onSelectBlock={selectBlock} onBack={goHome} />
      )}

      {screen.name === "dia-detail" &&
        (() => {
          const block = routineBlocks.find((b) => b.id === screen.blockId);
          if (!block) return null;
          return (
            <MiDiaDetail
              block={block}
              onBack={() => setScreen({ name: "dia" })}
              onReplay={() =>
                playFor({ name: block.title, relation: null, audio_url: block.audio_url })
              }
            />
          );
        })()}

      {screen.name === "familia-n1" && (
        <FamiliaNivel1
          hijos={tree.hijos}
          page={screen.page}
          onPageChange={(page) => setScreen({ name: "familia-n1", page })}
          onSelectHijo={selectHijo}
        />
      )}

      {screen.name === "familia-n2" &&
        (() => {
          const hijo = tree.personById.get(screen.hijoId);
          if (!hijo) return null;
          const descendants = tree.descendantsByHijo.get(screen.hijoId) ?? [];
          return (
            <FamiliaNivel2
              hijo={hijo}
              descendants={descendants}
              page={screen.page}
              onPageChange={(page) =>
                setScreen({ name: "familia-n2", hijoId: screen.hijoId, page })
              }
              onSelectPerson={(person) => selectDescendant(screen.hijoId, screen.page, person)}
              onBack={() => setScreen({ name: "familia-n1", page: 0 })}
            />
          );
        })()}

      {screen.name === "familia-n3" &&
        (() => {
          const person = tree.personById.get(screen.personId);
          if (!person) return null;
          const parentName = person.parent_id
            ? tree.personById.get(person.parent_id)?.name
            : undefined;
          const depth = (tree.descendantsByHijo.get(screen.hijoId) ?? []).find(
            (p) => p.id === person.id
          )?.depth;
          return (
            <FamiliaNivel3
              person={{ ...person, depth: depth ?? 1 }}
              parentName={parentName}
              onReplay={() => playFor(person)}
              onBack={() =>
                setScreen({ name: "familia-n2", hijoId: screen.hijoId, page: screen.n2Page })
              }
            />
          );
        })()}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-zinc-50 px-6 text-center">
      {children}
    </div>
  );
}
