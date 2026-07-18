-- Fase: album de fotos y videos sueltos de la familia (no atados a una
-- persona puntual del arbol). Mismo patron de seguridad que people/
-- people_public: is_active/private_note solo los ve el panel
-- (authenticated); la app de mama (anon) solo lee memories_public.

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  media_type text not null, -- 'photo' | 'video'
  caption text,
  is_active boolean not null default true,
  private_note text, -- solo panel, nunca en la app de mama
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists memories_is_active_idx on memories (is_active);

alter table memories enable row level security;

create policy "authenticated full access memories"
  on memories for all
  to authenticated
  using (true)
  with check (true);

create or replace view memories_public as
select id, media_url, media_type, caption, display_order
from memories
where is_active = true;

grant select on memories_public to anon;
