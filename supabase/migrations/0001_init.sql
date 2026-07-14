-- Fase 1: estructura base para el arbol familiar y la rutina diaria.
-- La tabla `people` guarda TODO (incluida private_note), y solo es
-- alcanzable por `authenticated` (panel familiar, fase 2) y `service_role`.
-- La app de mama (rol `anon`, sin login) solo puede leer la vista
-- `people_public`, que ni siquiera expone la columna private_note/sensitive_note.

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  audio_url text,
  relation text, -- 'hijo', 'nieto', 'bisnieto', 'esposo', 'esposa', etc.
  parent_id uuid references people(id) on delete cascade, -- null si es hijo directo de mama
  phone_number text, -- solo relevante para hijos directos (Nivel 1)
  is_active boolean not null default true,
  private_note text, -- solo visible en el panel familiar, nunca en la app de mama
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists people_parent_id_idx on people (parent_id);
create index if not exists people_is_active_idx on people (is_active);

create table if not exists routine_blocks (
  id uuid primary key default gen_random_uuid(),
  time_label text, -- 'manana', 'mediodia', 'tarde', 'noche'
  start_hour int not null,
  end_hour int not null,
  icon text,
  title text not null,
  description text,
  audio_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table people enable row level security;
alter table routine_blocks enable row level security;

-- Panel familiar (fase 2): usuarios autenticados administran todo.
create policy "authenticated full access people"
  on people for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full access routine_blocks"
  on routine_blocks for all
  to authenticated
  using (true)
  with check (true);

-- App de mama: acceso de solo lectura, filas activas, columnas seguras.
-- (routine_blocks no tiene datos sensibles, se expone la tabla directo)
create policy "anon read active routine_blocks"
  on routine_blocks for select
  to anon
  using (true);

-- Vista publica: nunca incluye private_note/sensitive_note.
-- Se deja con el comportamiento por defecto (security_invoker = false), para
-- que la vista se ejecute con los permisos de su dueno (que en Supabase
-- puede leer la tabla completa) y el filtro `where is_active = true` se
-- aplique siempre, sin depender de que el rol `anon` tenga una policy propia
-- sobre la tabla `people` (que justamente no queremos otorgarle).
create or replace view people_public as
select
  id,
  name,
  photo_url,
  audio_url,
  relation,
  parent_id,
  phone_number,
  display_order
from people
where is_active = true;

grant select on people_public to anon;
grant select on routine_blocks to anon;
