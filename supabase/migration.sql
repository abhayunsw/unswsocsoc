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
-- NEW: Structured discussion questions — run in a new SQL Editor tab
-- ============================================================

-- Parsed handout structure rendered by DiscussionViewer.jsx.
-- question_doc keeps holding the original .docx URL for the download button.
alter table public.events
  add column if not exists question_json jsonb;

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
  bio           text,
  degree        text,
  why_exec      text,
  fav_philosophy text,
  created_at    timestamptz default now()
);

-- 8. RLS
alter table public.team enable row level security;

create policy "Public can read team"
  on public.team for select using (true);

create policy "Owner can insert team"
  on public.team for insert
  with check (auth.email() = 'abhayunsw@gmail.com');

create policy "Owner can update team"
  on public.team for update
  using (auth.email() = 'abhayunsw@gmail.com');

create policy "Owner can delete team"
  on public.team for delete
  using (auth.email() = 'abhayunsw@gmail.com');

-- 9. Seed with full profiles
insert into public.team (name, role, display_order, degree, why_exec, fav_philosophy) values
  ('Gabe',      'President',          0, '4th year, part-time B Economics', 'Inspired by the quality and turnout of the USYD philosophy society and finding few opportunities for interesting debate at UNSW, I wanted to create an awesome community running weekly events revolving around the ideas of past philosophers.', 'Spinoza'),
  ('Nishan',    'Vice President',     1, '3rd year, B Economics/Psychology', 'I wanted to help create a society from scratch, and build it up to something memorable for others interested in Socratic talk and topics.', 'Stoicism'),
  ('Masashige', 'Welfare Officer',    2, '4th year, B Law and Physics', 'I have spent a lot of time discussing philosophy for pleasure and as a means of reflection on how to orient myself through the world.', 'Kierkegaard'),
  ('Stefan',    'Marketing Director', 3, '5th year, B Mechanical Engineering and Comp Sci', 'I believe there are benefits to having a community centred around consistent and truth-seeking philosophical dialogue.', 'Reginald Garrigou-Lagrange'),
  ('Sophie',    'Secretary',          4, '3rd year, B Advanced Science (Biotechnology)', 'I want to learn more about philosophy and connect with others who are also interested in learning about the world we live in.', 'Eastern philosophy, wabi sabi'),
  ('Josh',      'Events Director',    5, '3rd year, B Engineering (Mechatronic)', 'I find philosophical discussion useful for solving life''s problems and promoting that in an awesome community is very rewarding.', 'Stoicism, Marcus Aurelius'),
  ('Paris',     'Strategic Director', 6, '5th Year Advanced Mathematics / Computer Science', 'I am passionate about philosophy and want to contribute to philosophical discourse and debate.', 'Ethics, Epistemology, Metaphysics'),
  ('Nicole',    'Compliance Officer', 7, '2nd year, B Psychology', 'I joined the club because I wished to learn philosophy along my quest to become a polymath.', 'Postmodernism'),
  ('Ben',       'Treasurer',          8, '3rd year, B Economics', 'I joined the club because I like philosophy.', 'Ethics'),
  ('Abhay',     'Digital Content Director', 9, 'Computer Science', 'I direct content and manage the society''s digital presence.', null);
  