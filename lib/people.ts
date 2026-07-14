import { supabase } from "./supabase/client";
import type { FamilyTree, PublicPerson, TreePerson } from "./types";

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

// Arma el arbol en memoria a partir de la lista plana de personas activas.
// - hijos: personas sin parent_id (hijos directos de mama), Nivel 1.
// - descendantsByHijo[hijoId]: TODOS los descendientes de ese hijo
//   (esposo/a, nietos, bisnietos, ...) aplanados en una sola lista para
//   Nivel 2, sin importar cuantas generaciones tenga esa rama.
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

  const hijos = people
    .filter((p) => !p.parent_id)
    .sort((a, b) => a.display_order - b.display_order);

  const descendantsByHijo = new Map<string, TreePerson[]>();
  for (const hijo of hijos) {
    descendantsByHijo.set(hijo.id, flattenDescendants(hijo.id, childrenByParent));
  }

  return { hijos, personById, descendantsByHijo };
}

function flattenDescendants(
  rootId: string,
  childrenByParent: Map<string, PublicPerson[]>
): TreePerson[] {
  const result: TreePerson[] = [];
  const queue: { id: string; depth: number }[] = [{ id: rootId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    const children = childrenByParent.get(id) ?? [];
    for (const child of children) {
      result.push({ ...child, depth: depth + 1 });
      queue.push({ id: child.id, depth: depth + 1 });
    }
  }

  return result;
}
