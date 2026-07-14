"use client";

import { useEffect, useState } from "react";
import { fetchAllPeople } from "@/lib/peopleAdmin";
import type { AdminPerson } from "@/lib/types";
import PersonForm from "./PersonForm";
import PersonList from "./PersonList";

type View = { name: "list" } | { name: "create" } | { name: "edit"; person: AdminPerson };

export default function PeoplePanel() {
  const [people, setPeople] = useState<AdminPerson[] | null>(null);
  const [view, setView] = useState<View>({ name: "list" });

  useEffect(() => {
    loadPeople();
  }, []);

  function loadPeople() {
    fetchAllPeople().then(setPeople);
  }

  if (!people) return <p>Cargando...</p>;

  if (view.name === "list") {
    return (
      <PersonList
        people={people}
        onCreate={() => setView({ name: "create" })}
        onEdit={(person) => setView({ name: "edit", person })}
        onChanged={loadPeople}
      />
    );
  }

  return (
    <PersonForm
      allPeople={people}
      initialValue={view.name === "edit" ? view.person : undefined}
      onSaved={() => {
        setView({ name: "list" });
        loadPeople();
      }}
      onCancel={() => setView({ name: "list" })}
    />
  );
}
