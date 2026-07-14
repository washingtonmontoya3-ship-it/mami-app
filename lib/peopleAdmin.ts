import { supabase } from "./supabase/client";
import type { AdminPerson, AdminPersonInput } from "./types";

const ADMIN_COLUMNS =
  "id, name, photo_url, audio_url, relation, parent_id, phone_number, is_active, private_note, display_order";

export async function fetchAllPeople(): Promise<AdminPerson[]> {
  const { data, error } = await supabase
    .from("people")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createPerson(input: AdminPersonInput): Promise<AdminPerson> {
  const display_order = await nextDisplayOrder(input.parent_id);
  const { data, error } = await supabase
    .from("people")
    .insert({ ...input, display_order })
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePerson(
  id: string,
  input: AdminPersonInput
): Promise<AdminPerson> {
  const { data, error } = await supabase
    .from("people")
    .update(input)
    .eq("id", id)
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) throw error;
}

async function nextDisplayOrder(parentId: string | null): Promise<number> {
  let query = supabase.from("people").select("display_order").order("display_order", {
    ascending: false,
  });
  query = parentId === null ? query.is("parent_id", null) : query.eq("parent_id", parentId);

  const { data, error } = await query.limit(1);
  if (error) throw error;
  return (data?.[0]?.display_order ?? 0) + 1;
}

export async function uploadMedia(file: File, folder: "photos" | "audio"): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export type AdminTreeRow = {
  person: AdminPerson;
  depth: number;
};

// Recorrido en preorden (raices = hijos de mama, seguidos de sus
// descendientes) con profundidad, para pintar la lista y el selector de
// "padre" con sangria visual.
export function buildAdminOrder(people: AdminPerson[]): AdminTreeRow[] {
  const childrenByParent = new Map<string, AdminPerson[]>();
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

  const result: AdminTreeRow[] = [];
  function visit(person: AdminPerson, depth: number) {
    result.push({ person, depth });
    for (const child of childrenByParent.get(person.id) ?? []) {
      visit(child, depth + 1);
    }
  }
  for (const root of roots) visit(root, 0);

  return result;
}
