"use client";

import { useEffect, useState } from "react";
import { fetchAllMemories } from "@/lib/memoriesAdmin";
import type { AdminMemory } from "@/lib/types";
import MemoryForm from "./MemoryForm";
import MemoryList from "./MemoryList";

type View = { name: "list" } | { name: "create" } | { name: "edit"; memory: AdminMemory };

export default function MemoriesPanel() {
  const [memories, setMemories] = useState<AdminMemory[] | null>(null);
  const [view, setView] = useState<View>({ name: "list" });

  useEffect(() => {
    loadMemories();
  }, []);

  function loadMemories() {
    fetchAllMemories().then(setMemories);
  }

  if (!memories) return <p>Cargando...</p>;

  if (view.name === "list") {
    return (
      <MemoryList
        memories={memories}
        onCreate={() => setView({ name: "create" })}
        onEdit={(memory) => setView({ name: "edit", memory })}
        onChanged={loadMemories}
      />
    );
  }

  return (
    <MemoryForm
      initialValue={view.name === "edit" ? view.memory : undefined}
      onSaved={() => {
        setView({ name: "list" });
        loadMemories();
      }}
      onCancel={() => setView({ name: "list" })}
    />
  );
}
