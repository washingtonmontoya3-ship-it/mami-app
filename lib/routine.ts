import { supabase } from "./supabase/client";
import type { RoutineBlock } from "./types";

export async function fetchRoutineBlocks(): Promise<RoutineBlock[]> {
  const { data, error } = await supabase
    .from("routine_blocks")
    .select(
      "id, time_label, start_hour, end_hour, icon, title, description, audio_url, display_order"
    )
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Compara la hora actual (0-23) contra el rango del bloque. Soporta rangos
// que cruzan la medianoche (ej. noche: start_hour=19, end_hour=6).
export function isCurrentBlock(block: RoutineBlock, hour: number): boolean {
  const { start_hour, end_hour } = block;
  if (start_hour === end_hour) return false;
  if (start_hour < end_hour) {
    return hour >= start_hour && hour < end_hour;
  }
  return hour >= start_hour || hour < end_hour;
}
