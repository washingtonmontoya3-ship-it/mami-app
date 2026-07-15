"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";
import PeoplePanel from "./PeoplePanel";

export default function PanelApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (session === null) return <LoginForm />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel Familiar</h1>
        <LogoutButton />
      </div>

      <PeoplePanel />
    </div>
  );
}
