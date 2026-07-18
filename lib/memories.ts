import { supabase } from "./supabase/client";
import type { Memory } from "./types";

export async function fetchActiveMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories_public")
    .select("id, media_url, media_type, caption, display_order")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
