-- Pyramid Studio — content, contact messages, admins and media storage

-- admins: only users listed here can edit the site
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins can read own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admins to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- site_content: one JSON document per id ('main' holds the whole site)
create table public.site_content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy "anyone can read content" on public.site_content
  for select to anon, authenticated using (true);
create policy "admins can insert content" on public.site_content
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins can update content" on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

-- messages: the public contact form writes here, admins read them
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  company text not null default '' check (char_length(company) <= 200),
  phone text not null check (char_length(phone) between 3 and 40),
  email text not null default '' check (char_length(email) <= 200),
  service text not null default '' check (char_length(service) <= 100),
  budget text not null default '' check (char_length(budget) <= 100),
  message text not null default '' check (char_length(message) <= 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_created_at_idx on public.messages (created_at desc);
alter table public.messages enable row level security;
create policy "anyone can send a message" on public.messages
  for insert to anon, authenticated with check (read = false);
create policy "admins can read messages" on public.messages
  for select to authenticated using ((select public.is_admin()));
create policy "admins can update messages" on public.messages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins can delete messages" on public.messages
  for delete to authenticated using ((select public.is_admin()));
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

-- media bucket: public read, admins upload
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 104857600, array['image/*', 'video/*'])
on conflict (id) do nothing;

create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins list media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select public.is_admin()));
