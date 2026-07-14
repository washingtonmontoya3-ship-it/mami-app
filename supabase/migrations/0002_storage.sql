-- Fase 2: bucket publico de solo lectura para fotos y audio del panel
-- familiar. Solo el rol `authenticated` (panel, con login) puede subir,
-- actualizar o borrar archivos; cualquiera con el link puede leerlos (los
-- links no son adivinables). La privacidad real de una persona sensible la
-- sigue dando `is_active` en la tabla `people`, no el bucket.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  to public
  using (bucket_id = 'media');

create policy "authenticated insert media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "authenticated update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "authenticated delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
