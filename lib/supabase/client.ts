import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copia .env.local.example a .env.local y completa los valores."
  );
}

// Cliente compartido: la app de mama lo usa anonimo (solo lee `people_public`),
// y el panel familiar lo usa autenticado tras el login
// (supabase.auth.signInWithPassword), lo que habilita el acceso completo a
// `people` y a subir archivos en Storage, segun las RLS de
// supabase/migrations/0001_init.sql y 0002_storage.sql.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
