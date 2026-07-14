import { supabase } from "./supabase/client";
import type { RoutineBlock, RoutineBlockInput } from "./types";

const ADMIN_COLUMNS =
  "id, time_label, start_hour, end_hour, icon, title, description, audio_url, display_order";

export async function fetchAllBlocks(): Promise<RoutineBlock[]> {
  const { data, error } = await supabase
    .from("routine_blocks")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createBlock(input: RoutineBlockInput): Promise<RoutineBlock> {
  const display_order = await nextDisplayOrder();
  const { data, error } = await supabase
    .from("routine_blocks")
    .insert({ ...input, display_order })
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlock(
  id: string,
  input: RoutineBlockInput
): Promise<RoutineBlock> {
  const { data, error } = await supabase
    .from("routine_blocks")
    .update(input)
    .eq("id", id)
    .select(ADMIN_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlock(id: string): Promise<void> {
  const { error } = await supabase.from("routine_blocks").delete().eq("id", id);
  if (error) throw error;
}

async function nextDisplayOrder(): Promise<number> {
  const { data, error } = await supabase
    .from("routine_blocks")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.display_order ?? 0) + 1;
}
