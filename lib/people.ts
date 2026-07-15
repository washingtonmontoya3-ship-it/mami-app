import { supabase } from "./supabase/client";
import type { FamilyTree, PublicPerson } from "./types";

export async function fetchAllActivePeople(): Promise<PublicPerson[]> {
  const { data, error } = await supabase
    .from("people_public")
    .select(
      "id, name, photo_url, audio_url, relation, parent_id, phone_number, display_order"
    )
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Arma el arbol en memoria a partir de la lista plana de personas activas:
// agrupa por parent_id para poder navegar un nivel a la vez, sin importar
// cuantas generaciones tenga cada rama.
export function buildTree(people: PublicPerson[]): FamilyTree {
  const personById = new Map(people.map((p) => [p.id, p]));

  const childrenByParent = new Map<string, PublicPerson[]>();
  for (const person of people) {
    if (!person.parent_id) continue;
    const siblings = childrenByParent.get(person.parent_id) ?? [];
    siblings.push(person);
    childrenByParent.set(person.parent_id, siblings);
  }
  for (const siblings of childrenByParent.values()) {
    siblings.sort((a, b) => a.display_order - b.display_order);
  }

  const roots = people
    .filter((p) => !p.parent_id)
    .sort((a, b) => a.display_order - b.display_order);

  return { roots, personById, childrenByParent };
}
