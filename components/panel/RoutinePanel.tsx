"use client";

import { useEffect, useState } from "react";
import { fetchAllBlocks } from "@/lib/routineAdmin";
import type { RoutineBlock } from "@/lib/types";
import RoutineForm from "./RoutineForm";
import RoutineList from "./RoutineList";

type View = { name: "list" } | { name: "create" } | { name: "edit"; block: RoutineBlock };

export default function RoutinePanel() {
  const [blocks, setBlocks] = useState<RoutineBlock[] | null>(null);
  const [view, setView] = useState<View>({ name: "list" });

  useEffect(() => {
    loadBlocks();
  }, []);

  function loadBlocks() {
    fetchAllBlocks().then(setBlocks);
  }

  if (!blocks) return <p>Cargando...</p>;

  if (view.name === "list") {
    return (
      <RoutineList
        blocks={blocks}
        onCreate={() => setView({ name: "create" })}
        onEdit={(block) => setView({ name: "edit", block })}
        onChanged={loadBlocks}
      />
    );
  }

  return (
    <RoutineForm
      initialValue={view.name === "edit" ? view.block : undefined}
      onSaved={() => {
        setView({ name: "list" });
        loadBlocks();
      }}
      onCancel={() => setView({ name: "list" })}
    />
  );
}
