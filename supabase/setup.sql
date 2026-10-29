-- Gattabara Games website: one-time Supabase setup.   Supabase dashboard -> SQL Editor -> paste -> Run.
--
-- ORDER MATTERS:
--   1. In Vercel add  SUPABASE_SERVICE_ROLE_KEY  (Supabase -> Project Settings -> API Keys -> the "secret" / service_role key).
--      Server only, never prefix it with NEXT_PUBLIC_.  Redeploy.
--   2. Check /admingg: saving a change works.
--   3. Then run this file. It locks the tables down so the public key can only do what visitors need.
--
-- What the site stores:
--   cms_settings  row 1 only (database rule). This site keeps its content in data.site and the previous version in data.site_backup;
--                 the previous site's keys in the same row are preserved.
--   inquiries     Contact + Pitch-us submissions (same table the previous site used).
--   heartbeat     row 1, pinged by the keep-alive cron so the project does not pause.

-- 1. Bucket for application attachments (public read; visitors may upload only under applications/)
insert into storage.buckets (id, name, public, file_size_limit)
values ('gg-content', 'gg-content', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "gg-content visitors upload" on storage.objects;
create policy "gg-content visitors upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'gg-content' and (storage.foldername(name))[1] = 'applications');

drop policy if exists "gg-content public read" on storage.objects;
create policy "gg-content public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'gg-content');

-- 2. inquiries: visitors can only ADD a row. Reading and deleting happen in /admingg through the service role key.
alter table public.inquiries enable row level security;
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'inquiries' loop
    execute format('drop policy %I on public.inquiries', r.policyname);
  end loop;
end $$;
create policy "visitors can submit" on public.inquiries for insert to anon, authenticated with check (true);

-- 3. cms_settings: the website may READ the content; only the service role (the admin) can write it.
alter table public.cms_settings enable row level security;
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'cms_settings' loop
    execute format('drop policy %I on public.cms_settings', r.policyname);
  end loop;
end $$;
create policy "public can read content" on public.cms_settings for select to anon, authenticated using (true);

-- 4. heartbeat: service role only (the cron uses it)
alter table public.heartbeat enable row level security;
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'heartbeat' loop
    execute format('drop policy %I on public.heartbeat', r.policyname);
  end loop;
end $$;
