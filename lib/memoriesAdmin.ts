import { supabase } from "./supabase/client";
import type { AdminMemory, AdminMemoryInput } from "./types";

const ADMIN_COLUMNS =
  "id, media_url, media_type, caption, is_active, private_note, display_order";

export async function fetchAllMemories(): Promise<AdminMemory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createMemory(input: AdminMemoryInput): Promise<AdminMemory> {
  const display_order = await nextDisplayOrder();
  const { data, error } = await supabase
    .from("memories")
    .insert({ ...input, display_order })
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMemory(
  id: string,
  input: AdminMemoryInput
): Promise<AdminMemory> {
  const { data, error } = await supabase
    .from("memories")
    .update(input)
    .eq("id", id)
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from("memories").delete().eq("id", id);
  if (error) throw error;
}

async function nextDisplayOrder(): Promise<number> {
  const { data, error } = await supabase
    .from("memories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.display_order ?? 0) + 1;
}
