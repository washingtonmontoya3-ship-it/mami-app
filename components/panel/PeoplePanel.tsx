"use client";

import { useEffect, useState } from "react";
import { fetchAllPeople } from "@/lib/peopleAdmin";
import type { AdminPerson } from "@/lib/types";
import PersonBrowser from "./PersonBrowser";
import PersonForm from "./PersonForm";

type View = { name: "browse" } | { name: "create" } | { name: "edit"; person: AdminPerson };

export default function PeoplePanel() {
  const [people, setPeople] = useState<AdminPerson[] | null>(null);
  const [stack, setStack] = useState<(string | null)[]>([null]);
  const [view, setView] = useState<View>({ name: "browse" });

  useEffect(() => {
    loadPeople();
  }, []);

  function loadPeople() {
    fetchAllPeople().then(setPeople);
  }

  if (!people) return <p>Cargando...</p>;

  const currentParentId = stack[stack.length - 1];

  if (view.name !== "browse") {
    return (
      <PersonForm
        allPeople={people}
        initialValue={view.name === "edit" ? view.person : undefined}
        defaultParentId={view.name === "create" ? currentParentId : undefined}
        onSaved={() => {
          setView({ name: "browse" });
          loadPeople();
        }}
        onCancel={() => setView({ name: "browse" })}
      />
    );
  }

  const currentPerson = currentParentId ? people.find((p) => p.id === currentParentId) : undefined;
  const title = currentPerson ? `Familia de ${currentPerson.name}` : "Personas";

  return (
    <PersonBrowser
      people={people}
      parentId={currentParentId}
      title={title}
      onBack={stack.length > 1 ? () => setStack((s) => s.slice(0, -1)) : undefined}
      onNavigate={(person) => setStack((s) => [...s, person.id])}
      onCreate={() => setView({ name: "create" })}
      onEdit={(person) => setView({ name: "edit", person })}
      onChanged={loadPeople}
    />
  );
}
