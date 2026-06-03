-- ============================================================
-- Socratic Society UNSW — Supabase migration
-- Run this in: Supabase dashboard → SQL Editor
-- ============================================================

-- 1. Events table
create table if not exists public.events (
  id            uuid        primary key default gen_random_uuid(),
  week          integer     not null,
  type          text        not null,
  title         text        not null,
  date          timestamptz not null,
  location      text,
  building      text        default 'University of New South Wales',
  image_url     text,
  question_doc  text,
  instagram_post text,
  created_at    timestamptz default now()
);

-- 2. Row-level security
alter table public.events enable row level security;

create policy "Public can read events"
  on public.events for select
  using (true);

create policy "Authenticated can insert events"
  on public.events for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated can update events"
  on public.events for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can delete events"
  on public.events for delete
  using (auth.role() = 'authenticated');

-- 3. Storage bucket  (run in SQL editor — or create manually in Storage UI)
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Public can read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Authenticated can upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and auth.role() = 'authenticated');

create policy "Authenticated can delete event images"
  on storage.objects for delete
  using (bucket_id = 'event-images' and auth.role() = 'authenticated');

-- 4. Seed: the 3 existing events
--    image_url is null — upload the JPGs from src/assets/ to the
--    event-images bucket, then run the UPDATE statements below.
insert into public.events (week, type, title, date, location) values
  (1, 'Discussion',               'Is Religion A Scam?',  '2025-06-05T17:00:00+10:00', 'Morven Brown G3'),
  (1, 'Collaborative Discussion', 'Is Democracy Suicide?','2025-06-06T17:00:00+10:00', 'Quadrangle G053'),
  (2, 'Discussion',               'What Is Happiness?',   '2025-06-12T17:00:00+10:00', 'Morven Brown G3');

-- 5. After uploading images via Storage UI or admin panel, set their URLs:
--    update public.events set image_url = '<public-url>' where title = 'Is Religion A Scam?';
--    update public.events set image_url = '<public-url>' where title = 'Is Democracy Suicide?';
--    update public.events set image_url = '<public-url>' where title = 'What Is Happiness?';

-- 6. Create admin user (do this in: Authentication → Users → Invite / Add user)
--    Email: abhayunsw@gmail.com  (or whatever you prefer)
--    Set a strong password there — do NOT store passwords in SQL.

-- ============================================================
-- NEW: Team table — run this section in a new SQL Editor tab
-- ============================================================

-- 7. Team table
create table if not exists public.team (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  role          text        not null,
  photo_url     text,
  display_order integer     not null default 0,
  created_at    timestamptz default now()
);

-- 8. Row-level security (write access restricted to site owner only)
alter table public.team enable row level security;

create policy "Public can read team"
  on public.team for select
  using (true);

create policy "Owner can insert team"
  on public.team for insert
  with check (auth.email() = 'abhayunsw@gmail.com');

create policy "Owner can update team"
  on public.team for update
  using (auth.email() = 'abhayunsw@gmail.com');

create policy "Owner can delete team"
  on public.team for delete
  using (auth.email() = 'abhayunsw@gmail.com');

-- 9. Seed: existing exec team
insert into public.team (name, role, display_order) values
  ('Gabriel Kennedy', 'President',               0),
  ('Sophie Johnstone','Vice President',           1),
  ('Anna O''Regan',   'Secretary',                2),
  ('Abhay Sharma',    'Digital Content Director', 3),
  ('Nicole Bayona',   'Compliance Officer',       4),
  ('Wilson Haski',    'Marketing Director',       5),
  ('Ben Supit',       'Treasurer',                6),
  ('M Anik Ali',      'Event Director',           7);
