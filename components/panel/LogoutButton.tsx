"use client";

import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium"
    >
      Cerrar sesión
    </button>
  );
}
